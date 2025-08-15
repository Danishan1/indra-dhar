// controllers/item.controller.js
import { Item } from "../models/Item.js";
import { ReturnRequest } from "../models/ReturnRequest.js";
import mongoose from "mongoose";
import { ItemDetails } from "../models/ItemDetails.js";
import { itemDetailsSchema } from "./helper/itemDetailsSchema.js";
import { Phase } from "../models/Phase.js";
import { BulkItem } from "../models/BulkItem.js";

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
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ error: "Invalid ID" });

    const item = await Item.findOne({ _id: id, tenantId })
      .populate("currentPhaseId")
      .populate("history.userId", "name")
      .lean();

    if (!item) return res.status(404).json({ error: "Item not found" });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Move item forward
 */
export const moveItem = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params; // bulkGroupId or itemId
    const { toPhaseId, quantity, itemIds } = req.body;

    if (!mongoose.isValidObjectId(toPhaseId)) {
      return res.status(400).json({ error: "Invalid phase ID" });
    }

    // If it's a count-based bulk movement
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
        return res.status(400).json({ error: "Not enough quantity available" });
      }

      // Deduct from current bulk
      bulkItem.quantity -= quantity;
      bulkItem.history.push({
        phaseId: bulkItem.currentPhaseId,
        userId: req.user._id,
        action: "MOVE_FORWARD",
        count: -quantity,
        note: `Moved ${quantity} to next phase`,
      });
      await bulkItem.save();

      // Add to next phase bulk (create or update)
      let nextPhaseBulk = await Item.findOne({
        tenantId,
        bulkGroupId: id,
        isBulkCountBased: true,
        currentPhaseId: toPhaseId,
      });

      if (!nextPhaseBulk) {
        nextPhaseBulk = new Item({
          tenantId,
          isBulkCountBased: true,
          bulkGroupId: id,
          quantity: quantity,
          currentPhaseId: toPhaseId,
          status: "IN_PROGRESS",
          history: [],
        });
      } else {
        nextPhaseBulk.quantity += quantity;
      }

      nextPhaseBulk.history.push({
        phaseId: toPhaseId,
        userId: req.user._id,
        action: "MOVE_FORWARD",
        count: quantity,
      });
      await nextPhaseBulk.save();

      return res.json({
        message: "Bulk moved successfully",
        fromPhaseId: bulkItem.currentPhaseId,
        toPhaseId,
        quantity,
      });
    }

    // If it's an ID-based movement
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res
        .status(400)
        .json({ error: "itemIds must be provided for ID-based movement" });
    }

    const updated = await Item.updateMany(
      { _id: { $in: itemIds }, tenantId, isBulkCountBased: false },
      {
        $set: { currentPhaseId: toPhaseId },
        $push: {
          history: {
            phaseId: toPhaseId,
            userId: req.user._id,
            action: "MOVE_FORWARD",
            itemIds: itemIds,
          },
        },
      }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "No items found to move" });
    }

    return res.json({
      message: "Items moved successfully",
      toPhaseId,
      movedCount: updated.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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
