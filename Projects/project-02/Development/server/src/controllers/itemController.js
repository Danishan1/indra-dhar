// controllers/item.controller.js
import { Item } from "../models/Item.js";
// import { ReturnRequest } from "../models/ReturnRequest.js";
// import mongoose from "mongoose";
import { ItemDetails } from "../models/ItemDetails.js";
import { itemDetailsSchema } from "./helper/itemDetailsSchema.js";
import { Phase } from "../models/Phase.js";
import { BulkItem } from "../models/BulkItem.js";
import { emitPhaseUpdate } from "../../server.js";
import { supabase } from "../config/db.js";

// export const createItem = async (req, res) => {
//   try {
//     const tenantId = req.user.tenantId;
//     const userId = req.user.userId;

//     // Handle validation
//     const { error, value } = itemDetailsSchema.validate(req.body, {
//       abortEarly: false,
//     });

//     if (error) {
//       const errorMessages = error.details.map((detail) => ({
//         field: detail.path[0],
//         message: detail.message,
//       }));
//       return res.status(400).json({ success: false, message: errorMessages });
//     }

//     // 1. Save item details
//     const itemDetails = new ItemDetails(value);
//     const savedItemDetails = await itemDetails.save();

//     // 2. Get phaseId
//     const phase = await Phase.findOne({ tenantId, name: "Po" });
//     if (!phase) {
//       return res.status(404).json({
//         success: false,
//         message: 'Phase "Po" not found for this tenant',
//       });
//     }
//     const phaseId = phase._id;

//     // 3. Create multiple items
//     const quantity = parseInt(req.body.items, 10); // Ensure it's a number
//     const itemsToCreate = [];
//     for (let i = 0; i < quantity; i++) {
//       itemsToCreate.push(
//         new Item({
//           tenantId,
//           phaseId,
//           itemDetailId: savedItemDetails._id,
//           status: "IN_PROGRESS",
//         })
//       );
//     }
//     const savedItems = await Item.insertMany(itemsToCreate);

//     // 4. Get uploaded image paths
//     const imagePaths =
//       req.files?.map((file) => `/uploads/${file.filename}`) || [];

//     // 5. Create BulkItem
//     const newBulkItem = new BulkItem({
//       tenantId,
//       phaseId,
//       pendingItemIds: savedItems.map((item) => item._id),
//       status: "IN_PROGRESS",
//       createdBy: userId,
//       images: imagePaths,
//     });

//     await newBulkItem.save();

//     return res.status(201).json({
//       success: true,
//       message: "Item and bulk items saved successfully",
//       data: savedItemDetails,
//     });
//   } catch (err) {
//     console.error("Error saving item:", err);
//     return res.status(500).json({
//       success: false,
//       error: "Server error. Failed to save item.",
//     });
//   }
// };

// export const bulkCreateItems = async (req, res) => {
//   try {
//     const tenantId = req.user.tenantId;
//     const userId = req.user.userId;

//     const itemsData = req.body.items; // Array of rows

//     if (!Array.isArray(itemsData) || itemsData.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No items provided." });
//     }

//     const phase = await Phase.findOne({ tenantId, name: "Po" });
//     if (!phase) {
//       return res.status(404).json({
//         success: false,
//         message: 'Phase "Po" not found for this tenant.',
//       });
//     }
//     const phaseId = phase._id;

//     let createdCount = 0;

//     for (const row of itemsData) {
//       // Validate row with Joi
//       const { error, value } = itemDetailsSchema.validate(row, {
//         abortEarly: false,
//       });
//       if (error) {
//         console.warn("Skipping invalid row:", row, error.message);
//         continue; // Skip invalid rows
//       }

//       // Save item details
//       const itemDetails = new ItemDetails(value);
//       const savedItemDetails = await itemDetails.save();

//       // Create items based on "items" count
//       const quantity = parseInt(row.items, 10);
//       const itemsToCreate = Array.from({ length: quantity }).map(
//         () =>
//           new Item({
//             tenantId,
//             phaseId,
//             itemDetailId: savedItemDetails._id,
//             status: "IN_PROGRESS",
//           })
//       );

//       const savedItems = await Item.insertMany(itemsToCreate);

//       // BulkItem record (images skipped here – can add later via upload)
//       const bulkItem = new BulkItem({
//         tenantId,
//         phaseId,
//         pendingItemIds: savedItems.map((item) => item._id),
//         status: "IN_PROGRESS",
//         createdBy: userId,
//         images: [], // You could later allow images via ZIP upload
//       });

//       await bulkItem.save();
//       createdCount++;
//     }

//     return res.status(201).json({
//       success: true,
//       message: `${createdCount} items successfully uploaded.`,
//     });
//   } catch (err) {
//     console.error("Bulk upload error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Bulk upload failed.",
//     });
//   }
// };

export const acceptedBy = async (req, res) => {
  try {
    const { id, role: requestedRole } = req.body;
    const { tenantId, role: userRole, userId } = req.user;

    if (userRole !== requestedRole) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this Acceptence",
      });
    }

    // 1. Find the BulkItem
    const bulkItem = await BulkItem.findOne({ tenantId, _id: id });

    if (!bulkItem) {
      return res.status(404).json({
        success: false,
        message: "Bulk item not found",
      });
    }

    // 2. Update and save
    bulkItem.acceptedBy = bulkItem.acceptedBy || userId;
    await bulkItem.save();

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: bulkItem,
    });
  } catch (err) {
    console.error("Error in acceptedBy:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// /**
//  * Get all items with filters
//  */
// export const listItems = async (req, res) => {
//   try {
//     const items = await ItemDetails.find({}, "name _id"); // Only select name and _id

//     const formattedItems = items.map((item) => ({
//       label: item.name,
//       value: item._id,
//     }));

//     return res.status(200).json({ data: formattedItems });
//   } catch (err) {
//     console.error("Error fetching item details list:", err);
//     return res.status(500).json({ error: "Failed to fetch item list" });
//   }
// };

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
        images: bulkItem.images || [],
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
    const { phaseName } = req.params;
    const { startDate, endDate, page = 1, limit = 50 } = req.query;

    // 1. Get phase by name
    const { data: phase, error: phaseError } = await supabase
      .from("node_phases")
      .select("*")
      .eq("name", phaseName)
      .single();

    if (phaseError || !phase) {
      return res.status(404).json({
        success: false,
        message: `Phase "${phaseName}" not found.`,
      });
    }

    // 2. Date filter (default last 6 months)
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        gte: new Date(startDate).toISOString(),
        lte: new Date(endDate).toISOString(),
      };
    } else {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      dateFilter = { gte: sixMonthsAgo.toISOString() };
    }

    // 3. Pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    // 4. Fetch bulk items
    const { data: bulkItems, error: bulkError } = await supabase
      .from("node_bulk_items")
      .select(
        `
        id,
        phase_id,
        status,
        images,
        created_at,
        created_by (id, name),
        accepted_by (id, name)
      `
      )
      .eq("phase_id", phase.id)
      .gte("created_at", dateFilter.gte)
      .lte("created_at", dateFilter.lte || new Date().toISOString())
      .order("created_at", { ascending: false })
      .range(from, to);

    if (bulkError) throw bulkError;

    // 5. For each bulkItem, fetch pending/completed items (join tables)
    const completedOrders = [];
    const incompleteOrders = [];
    const returnOrders = [];

    for (const item of bulkItems) {
      // pending items
      const { data: pendingItems } = await supabase
        .from("node_bulk_item_pending")
        .select(
          `
          item:node_items (
            id,
            item_detail_id (
              name,
              vendor_name,
              buyer_name,
              color
            )
          )
        `
        )
        .eq("bulk_item_id", item.id);

      // completed items
      const { data: completedItems } = await supabase
        .from("node_bulk_item_completed")
        .select(
          `
          item:node_items (
            id,
            item_detail_id (
              name,
              vendor_name,
              buyer_name,
              color
            )
          )
        `
        )
        .eq("bulk_item_id", item.id);

      const firstPending = pendingItems?.[0]?.item?.item_detail_id;
      const firstCompleted = completedItems?.[0]?.item?.item_detail_id;

      const itemDetails = firstPending || firstCompleted || {};

      const simplified = {
        id: item.id,
        itemName: itemDetails.name || "Unnamed Item",
        vendorName: itemDetails.vendor_name,
        buyerName: itemDetails.buyer_name,
        color: itemDetails.color,
        quantity: (pendingItems?.length || 0) + (completedItems?.length || 0),
        pendingItemCount: pendingItems?.length || 0,
        completedItemCount: completedItems?.length || 0,
        status: item.status,
        createdAt: item.created_at,
        createdBy: item.created_by?.name || "Unknown",
        acceptedBy: item.accepted_by?.name || "Pending",
        phaseName: phase.name,
        image: item.images?.length > 0 ? item.images[0] : "none",
      };

      if ((pendingItems?.length || 0) === 0) {
        completedOrders.push(simplified);
      } else {
        incompleteOrders.push(simplified);
      }

      if (item.status === "RETURNED" || item.status === "RETURNED_COMPLETED") {
        returnOrders.push(simplified);
      }
    }

    // 6. Response
    return res.status(200).json({
      success: true,
      data: {
        completedOrders,
        incompleteOrders,
        returnOrders,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: bulkItems.length === parseInt(limit),
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
    const { phaseName, bulkId } = req.params;
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
      .filter(
        (phase) => phase.order < currentPhase.order && phase.name !== "PO"
      ) // Only include phases that come before
      .map((phase) => ({
        label: phase.name, // Phase name as the label
        value: phase._id.toString(), // Phase ID as the value
      }));

    // Find the bulk item by ID and tenant
    const bulkItem =
      bulkId !== "null"
        ? await BulkItem.findOne({ _id: bulkId, tenantId })
        : [];
    const images = bulkItem.images || [];

    // Step 4: Send the phases before the current phase
    return res.status(200).json({
      success: true,
      data: { phasesBefore, images }, // List of { label, value } pairs for phases before current phase
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
    const userId = req.user.userId;
    const { phaseName, itemIds, quantity, type, bulkId, dispatchTo } = req.body;

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
    let nextPhase;
    if (dispatchTo) {
      nextPhase = await Phase.findOne({
        tenantId,
        name: dispatchTo,
      });
    } else {
      nextPhase = await Phase.findOne({
        tenantId,
        order: currentPhaseIndex + 1,
      });
    }
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
        bulkItem.status =
          bulkItem.status === "RETURNED" ? "RETURNED_COMPLETED" : "COMPLETED";

      // Update pendingItemIds and completedItemIds in the current BulkItem
      bulkItem.pendingItemIds = pendingItems;
      bulkItem.completedItemIds.push(...selectedItems);

      // 4. Get uploaded image paths

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

    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    // 5. Create a new BulkItem for the next phase
    const newBulkItem = new BulkItem({
      tenantId,
      phaseId: nextPhaseId,
      pendingItemIds: selectedItems,
      status: "IN_PROGRESS", // Default status for new BulkItem
      createdBy: userId,
      images: [...bulkItem.images, ...imagePaths],
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
      message: "Server error. Failed to move items.",
    });
  }
};

/**
 * Request return for an item
 */
/**
 * Move item backward
 */
export const moveItemBackward = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    const { phaseName, itemIds, quantity, type, bulkId, toPhase } = req.body;

    // 1. Get current phase and toPhase info
    const currentPhase = await Phase.findOne({ tenantId, name: phaseName });
    const targetPhase = await Phase.findOne({ tenantId, name: toPhase });

    if (!currentPhase || !targetPhase) {
      return res.status(400).json({
        success: false,
        message: `Invalid current or target phase.`,
      });
    }

    if (targetPhase.order >= currentPhase.order) {
      return res.status(400).json({
        success: false,
        message: `Cannot move to a same or later phase. toPhase must be earlier than current phase.`,
      });
    }

    const currentPhaseId = currentPhase._id;
    const toPhaseId = targetPhase._id;

    // 2. Find the BulkItem for the current phase
    const currentBulkItem = await BulkItem.findOne({
      tenantId,
      phaseId: currentPhaseId,
      _id: bulkId,
    });

    if (!currentBulkItem) {
      return res.status(404).json({
        success: false,
        message: `Bulk item not found in phase "${phaseName}".`,
      });
    }

    let selectedItems = [];

    if (type === "quantity") {
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity should be a positive number.",
        });
      }

      if (currentBulkItem.pendingItemIds.length < quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough completed items to move backward.",
        });
      }

      const pendingItems = [...currentBulkItem.pendingItemIds];
      selectedItems = pendingItems.splice(0, quantity);

      currentBulkItem.pendingItemIds = pendingItems;
      await currentBulkItem.save();
    } else if (type === "itemId" && itemIds && Array.isArray(itemIds)) {
      const invalidItemIds = itemIds.filter(
        (id) => !currentBulkItem.pendingItemIds.includes(id)
      );

      if (invalidItemIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `The following itemIds are not in the completed list: ${invalidItemIds.join(
            ", "
          )}`,
        });
      }

      selectedItems = itemIds;
      currentBulkItem.pendingItemIds = currentBulkItem.pendingItemIds.filter(
        (id) => !itemIds.includes(id)
      );
      await currentBulkItem.save();
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid operation type. Use 'quantity' or 'itemId'.",
      });
    }

    // 4. Get uploaded image paths
    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    // 3. Add items to the target phase BulkItem (or create if not exists)
    let targetBulkItem;
    targetBulkItem = new BulkItem({
      tenantId,
      phaseId: toPhaseId,
      pendingItemIds: selectedItems,
      completedItemIds: [],
      status: "RETURNED",
      createdBy: userId,
      images: [...currentBulkItem.images, ...imagePaths],
    });

    await targetBulkItem.save();
    emitPhaseUpdate(tenantId);

    return res.status(200).json({
      success: true,
      message: `Items moved backward to phase "${toPhase}" with status 'RETURNED'.`,
      data: selectedItems,
    });
  } catch (err) {
    console.error("Error moving items backward:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Failed to move items backward.",
    });
  }
};
