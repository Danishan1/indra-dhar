// controllers/item.controller.js
import { Item } from "../models/Item.js";
import { ReturnRequest } from "../models/ReturnRequest.js";
import mongoose from "mongoose";
import { ItemDetails } from "../models/ItemDetails.js";
import { itemDetailsSchema } from "./helper/itemDetailsSchema.js";
import { Phase } from "../models/Phase.js";
import { BulkItem } from "../models/BulkItem.js";
import { emitPhaseUpdate } from "../../server.js";

export const createItem = async (req, res) => {
  try {
    // Extract tenantId from authenticated user
    const tenantId = req.user.tenantId;

    // Validate and sanitize input
    const { error, value } = itemDetailsSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));
      return res.status(400).json({ success: false, message: errorMessages });
    }

    // 1. Save ItemDetails first
    const itemDetails = new ItemDetails(value);
    const savedItemDetails = await itemDetails.save(); // No session here

    // 2. Find the 'phaseId' for the phase "kora" using tenantId
    const phase = await Phase.findOne({ tenantId, name: "Kora" });
    if (!phase) {
      return res.status(404).json({
        success: false,
        message: 'Phase "kora" not found for this tenant',
      });
    }
    const phaseId = phase._id;

    // 3. Create and save 'Item' instances based on the quantity (req.body.items)
    const quantity = req.body.items;
    const itemsToCreate = [];

    for (let i = 0; i < quantity; i++) {
      const item = new Item({
        tenantId,
        phaseId, // Use the phaseId found from "kora"
        itemDetailId: savedItemDetails._id,
        status: "IN_PROGRESS", // Default status
      });
      itemsToCreate.push(item);
    }

    // 4. Save all the created items to the database
    const savedItems = await Item.insertMany(itemsToCreate); // No session here

    // 5. Add the saved items to the BulkItem's pending list
    const bulkItem = await BulkItem.findOne({
      tenantId,
      phaseId: req.body.phaseId,
    });

    if (!bulkItem) {
      // If no BulkItem exists for the phase, create a new one
      const newBulkItem = new BulkItem({
        tenantId,
        phaseId,
        pendingItemIds: savedItems.map((item) => item._id),
        status: "IN_PROGRESS", // Default status
      });
      await newBulkItem.save(); // No session here
    } else {
      // Add the items to the existing BulkItem's pending list
      bulkItem.pendingItemIds.push(...savedItems.map((item) => item._id));
      await bulkItem.save(); // No session here
    }

    return res.status(201).json({
      success: true,
      message: "Item and Bulk items saved successfully",
      data: savedItemDetails,
    });
  } catch (err) {
    console.error("Error saving item:", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Failed to save item.",
    });
  }
};

/**
 * Get all items with filters
 */
export const listItems = async (req, res) => {
  try {
    const items = await ItemDetails.find({}, "name _id"); // Only select name and _id

    const formattedItems = items.map((item) => ({
      label: item.name,
      value: item._id,
    }));

    return res.status(200).json({ data: formattedItems });
  } catch (err) {
    console.error("Error fetching item details list:", err);
    return res.status(500).json({ error: "Failed to fetch item list" });
  }
};

/**
 * Get single item details
 */
export const getItem = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { bulkId } = req.params;

    // Find the bulk item by ID and tenant
    const bulkItem = await BulkItem.findOne({ _id: bulkId, tenantId });

    if (!bulkItem) {
      return res.status(404).json({ error: "Bulk item not found" });
    }

    // Fetch related item details
    const pendingItems = bulkItem.pendingItemIds.map((k) => k.toString());
    const completedItems = bulkItem.completedItemIds.map((k) => k.toString());

    return res.json({
      bulkItem: {
        _id: bulkItem._id,
        tenantId: bulkItem.tenantId,
        phaseId: bulkItem.phaseId,
        status: bulkItem.status,
        createdAt: bulkItem.createdAt,
      },
      pendingItems,
      completedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBulkItems = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { phaseName } = req.params;

    // 1. Get phase by name for this tenant
    const phase = await Phase.findOne({ tenantId, name: phaseName });

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: `Phase "${phaseName}" not found for this tenant.`,
      });
    }

    // 2. Get bulk items for this phase/tenant
    const bulkItems = await BulkItem.find({
      tenantId,
      phaseId: phase._id,
    })
      .populate({
        path: "pendingItemIds",
        populate: { path: "itemDetailId" },
      })
      .populate({
        path: "completedItemIds",
        populate: { path: "itemDetailId" },
      })
      .sort({ createdAt: -1 });

    // 3. Split into completed/incomplete
    const completedOrders = [];
    const incompleteOrders = [];

    bulkItems.forEach((item) => {
      const firstPendingItem = item.pendingItemIds[0];
      const firstCompletedItem = item.completedItemIds[0];

      const itemDetails =
        firstPendingItem?.itemDetailId || firstCompletedItem?.itemDetailId;

      const simplified = {
        _id: item._id,
        itemName: itemDetails?.name || "Unnamed Item",
        vendorName: itemDetails?.vendorName,
        buyerName: itemDetails?.buyerName,
        color: itemDetails?.color,
        quantity: item.pendingItemIds.length + item.completedItemIds.length,
        pendingItemCount: item.pendingItemIds.length,
        completedItemCount: item.completedItemIds.length,
        status: item.status,
        createdAt: item.createdAt,
      };

      if (item.pendingItemIds.length === 0) {
        completedOrders.push(simplified);
      } else {
        incompleteOrders.push(simplified);
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        completedOrders,
        incompleteOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching bulk items:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bulk items",
      error: error.message,
    });
  }
};

export const getPhasesBefore = async (req, res) => {
  try {
    const { phaseName } = req.params;
    const { tenantId } = req.user; // Assuming tenantId is part of the user session or token

    // Step 1: Find the current phase based on phaseName and tenantId
    const currentPhase = await Phase.findOne({
      tenantId,
      name: phaseName,
    }).lean();

    if (!currentPhase) {
      return res
        .status(404)
        .json({ success: false, message: "Phase not found." });
    }

    // Step 2: Get all phases for this tenant ordered by 'order' (ascending)
    const allPhases = await Phase.find({ tenantId }).sort({ order: 1 }).lean();

    // Step 3: Filter out phases that come before the current phase based on the order
    const phasesBefore = allPhases
      .filter((phase) => phase.order < currentPhase.order) // Only include phases that come before
      .map((phase) => ({
        label: phase.name, // Phase name as the label
        value: phase._id.toString(), // Phase ID as the value
      }));

    // Step 4: Send the phases before the current phase
    return res.status(200).json({
      success: true,
      data: phasesBefore, // List of { label, value } pairs for phases before current phase
    });
  } catch (err) {
    console.error("Error fetching phases before:", err);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

/**
 * Move item forward
 */
export const moveItem = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { phaseName, itemIds, quantity, type, bulkId } = req.body;

    // 1. Retrieve the current phase ID from the database based on phaseName
    const currentPhase = await Phase.findOne({ tenantId, name: phaseName });

    if (!currentPhase) {
      return res.status(400).json({
        success: false,
        message: `Phase "${phaseName}" not found for tenant.`,
      });
    }

    const currentPhaseId = currentPhase._id;
    const currentPhaseIndex = currentPhase.order; // Assuming phase order is stored in the "order" field.

    // 2. Retrieve the next phase ID dynamically
    const nextPhase = await Phase.findOne({
      tenantId,
      order: currentPhaseIndex + 1,
    });

    if (!nextPhase) {
      return res.status(400).json({
        success: false,
        message: `No next phase found after "${phaseName}".`,
      });
    }

    const nextPhaseId = nextPhase._id;

    // 3. Find the BulkItem for the current phase
    const bulkItem = await BulkItem.findOne({
      tenantId,
      phaseId: currentPhaseId,
      _id: bulkId,
    });

    if (!bulkItem) {
      return res.status(404).json({
        success: false,
        message: `No bulk item found for phase "${phaseName}".`,
      });
    }

    // 4. Handle the two types of operations (quantity-based or itemId-based)
    let selectedItems = [];

    if (type === "quantity") {
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity should be a positive number.",
        });
      }

      // Validate that the bulk item has enough pending items
      if (bulkItem.pendingItemIds.length < quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough pending items to fulfill the quantity request.",
        });
      }

      // Select `quantity` items either sequentially or randomly
      const pendingItems = [...bulkItem.pendingItemIds]; // Copy array to prevent mutation

      selectedItems = pendingItems.splice(0, quantity);

      if (bulkItem.pendingItemIds.length === parseInt(quantity))
        bulkItem.status = "COMPLETED";

      // Update pendingItemIds and completedItemIds in the current BulkItem
      bulkItem.pendingItemIds = pendingItems;
      bulkItem.completedItemIds.push(...selectedItems);

      await bulkItem.save();
      emitPhaseUpdate(tenantId);
    } else if (type === "itemId" && itemIds && Array.isArray(itemIds)) {
      // Validate that the provided itemIds exist in the pending items
      const invalidItemIds = itemIds.filter(
        (id) => !bulkItem.pendingItemIds.includes(id)
      );

      if (invalidItemIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `The following itemIds are not in the pending list: ${invalidItemIds.join(
            ", "
          )}`,
        });
      }

      // Move the provided itemIds from pending to completed
      selectedItems = itemIds;
      bulkItem.pendingItemIds = bulkItem.pendingItemIds.filter(
        (id) => !itemIds.includes(id)
      );
      bulkItem.completedItemIds.push(...selectedItems);
      await bulkItem.save();
      emitPhaseUpdate(tenantId);
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Invalid operation type. Please specify 'quantity' or 'itemId'.",
      });
    }

    // 5. Create a new BulkItem for the next phase
    const newBulkItem = new BulkItem({
      tenantId,
      phaseId: nextPhaseId,
      pendingItemIds: selectedItems,
      status: "IN_PROGRESS", // Default status for new BulkItem
    });

    await newBulkItem.save();

    return res.status(200).json({
      success: true,
      message: `Items successfully moved to the next phase (${nextPhase.name})`,
      data: selectedItems,
    });
  } catch (err) {
    console.error("Error moving items:", err);
    return res.status(500).json({
      success: false,
      error: "Server error. Failed to move items.",
    });
  }
};

/**
 * Request return for an item
 */
export const requestItemReturn = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params; // bulkGroupId or itemId
    const { toPhaseId, note, quantity, itemIds } = req.body;

    if (!mongoose.isValidObjectId(toPhaseId)) {
      return res.status(400).json({ error: "Invalid phase ID" });
    }

    // Handle count-based bulk
    const bulkItem = await Item.findOne({
      tenantId,
      bulkGroupId: id,
      isBulkCountBased: true,
    });

    if (bulkItem) {
      if (!quantity || quantity <= 0) {
        return res
          .status(400)
          .json({ error: "Quantity must be greater than zero" });
      }
      if (bulkItem.quantity < quantity) {
        return res
          .status(400)
          .json({ error: "Not enough quantity available to return" });
      }

      // Create a return request log
      const returnRequest = await ReturnRequest.create({
        tenantId,
        bulkGroupId: id,
        isBulkCountBased: true,
        fromPhaseId: bulkItem.currentPhaseId,
        toPhaseId,
        quantity,
        requestedBy: req.user._id,
        note,
      });

      // Deduct from current phase
      bulkItem.quantity -= quantity;
      bulkItem.history.push({
        phaseId: bulkItem.currentPhaseId,
        userId: req.user._id,
        action: "RETURN",
        count: -quantity,
        note,
      });
      await bulkItem.save();

      // Add to target phase bulk
      let targetBulk = await Item.findOne({
        tenantId,
        bulkGroupId: id,
        isBulkCountBased: true,
        currentPhaseId: toPhaseId,
      });

      if (!targetBulk) {
        targetBulk = new Item({
          tenantId,
          isBulkCountBased: true,
          bulkGroupId: id,
          quantity: quantity,
          currentPhaseId: toPhaseId,
          status: "IN_PROGRESS",
          history: [],
        });
      } else {
        targetBulk.quantity += quantity;
      }

      targetBulk.history.push({
        phaseId: toPhaseId,
        userId: req.user._id,
        action: "RETURN",
        count: quantity,
      });
      await targetBulk.save();

      return res.status(201).json({
        message: "Bulk return request created successfully",
        returnRequest,
      });
    }

    // Handle ID-based return
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res
        .status(400)
        .json({ error: "itemIds must be provided for ID-based return" });
    }

    const items = await Item.find({
      _id: { $in: itemIds },
      tenantId,
      isBulkCountBased: false,
    });

    if (items.length === 0) {
      return res.status(404).json({ error: "No items found to return" });
    }

    // Create a return request log
    const returnRequest = await ReturnRequest.create({
      tenantId,
      itemIds: items.map((it) => it._id),
      fromPhaseId: items[0].currentPhaseId,
      toPhaseId,
      requestedBy: req.user._id,
      note,
    });

    // Update items to new phase
    await Item.updateMany(
      { _id: { $in: itemIds }, tenantId },
      {
        $set: { currentPhaseId: toPhaseId },
        $push: {
          history: {
            phaseId: toPhaseId,
            userId: req.user._id,
            action: "RETURN",
            itemIds: itemIds,
            note,
          },
        },
      }
    );

    return res.status(201).json({
      message: "Return request created successfully",
      returnRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
