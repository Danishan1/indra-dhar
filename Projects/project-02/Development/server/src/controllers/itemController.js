// controllers/item.controller.js
// import { Item } from "../models/Item.js";
// import { ReturnRequest } from "../models/ReturnRequest.js";
// import mongoose from "mongoose";
// import { ItemDetails } from "../models/ItemDetails.js";
// import { itemDetailsSchema } from "./helper/itemDetailsSchema.js";
// import { Phase } from "../models/Phase.js";
// import { BulkItem } from "../models/BulkItem.js";
// import { emitPhaseUpdate } from "../../server.js";
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
    const { role: userRole, userId } = req.user;

    // 1. Check if user role matches the requested role
    if (userRole !== requestedRole) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this acceptance",
      });
    }

    // 2. Fetch the bulk item
    const { data: bulkItem, error: fetchError } = await supabase
      .from("node_bulk_items")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !bulkItem) {
      return res.status(404).json({
        success: false,
        message: "Bulk item not found",
      });
    }

    // 3. Update the accepted_by field if not already set
    if (!bulkItem.accepted_by) {
      const { data: updatedItem, error: updateError } = await supabase
        .from("node_bulk_items")
        .update({ accepted_by: userId })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({
          success: false,
          message: "Failed to update bulk item",
          error: updateError.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item accepted successfully",
        data: updatedItem,
      });
    }

    // If already accepted
    return res.status(200).json({
      success: true,
      message: "Item was already accepted",
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
 * Get single bulk item details
 */
export const getItem = async (req, res) => {
  try {
    const { bulkId } = req.params;

    // 1. Fetch the bulk item
    const { data: bulkItem, error: bulkError } = await supabase
      .from("node_bulk_items")
      .select("*")
      .eq("id", bulkId)
      .single();

    if (bulkError || !bulkItem) {
      return res.status(404).json({ error: "Bulk item not found" });
    }

    // 2. Fetch pending item IDs
    const { data: pendingData, error: pendingError } = await supabase
      .from("node_bulk_item_pending")
      .select("item_id")
      .eq("bulk_item_id", bulkId);

    if (pendingError) {
      return res.status(500).json({ error: pendingError.message });
    }

    const pendingItems = pendingData.map((p) => p.item_id);

    // 3. Fetch completed item IDs
    const { data: completedData, error: completedError } = await supabase
      .from("node_bulk_item_completed")
      .select("item_id")
      .eq("bulk_item_id", bulkId);

    if (completedError) {
      return res.status(500).json({ error: completedError.message });
    }

    const completedItems = completedData.map((c) => c.item_id);

    // 4. Return response
    return res.json({
      bulkItem: {
        id: bulkItem.id,
        phaseId: bulkItem.phase_id,
        status: bulkItem.status,
        createdAt: bulkItem.created_at,
        images: bulkItem.images || [],
        createdBy: bulkItem.created_by,
        acceptedBy: bulkItem.accepted_by,
      },
      pendingItems,
      completedItems,
    });
  } catch (err) {
    console.error("Error fetching bulk item:", err);
    return res.status(500).json({ error: "Internal server error" });
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

/**
 * Get phases that come before a given phase
 */
export const getPhasesBefore = async (req, res) => {
  try {
    const { phaseName, bulkId } = req.params;

    // 1. Get the current phase
    const { data: currentPhase, error: currentError } = await supabase
      .from("node_phases")
      .select("*")
      .eq("name", phaseName)
      .single();

    if (currentError || !currentPhase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found.",
      });
    }

    // 2. Get all phases ordered by "order"
    const { data: allPhases, error: phasesError } = await supabase
      .from("node_phases")
      .select("*")
      .order("order", { ascending: true });

    if (phasesError) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch phases.",
        error: phasesError.message,
      });
    }

    // 3. Filter phases that come before current phase
    const phasesBefore = allPhases
      .filter(
        (phase) => phase.order < currentPhase.order && phase.name !== "Po"
      )
      .map((phase) => ({
        label: phase.name,
        value: phase.id,
      }));

    // 4. Get images from the bulk item if bulkId is provided
    let images = [];
    if (bulkId && bulkId !== "null") {
      const { data: bulkItem, error: bulkError } = await supabase
        .from("node_bulk_items")
        .select("images")
        .eq("id", bulkId)
        .single();

      if (bulkError && bulkError.code !== "PGRST116") {
        // PGRST116 = no rows found
        return res.status(500).json({
          success: false,
          message: "Failed to fetch bulk item images.",
          error: bulkError.message,
        });
      }

      images = bulkItem?.images || [];
    }

    return res.status(200).json({
      success: true,
      data: { phasesBefore, images },
    });
  } catch (err) {
    console.error("Error fetching phases before:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

/**
 * Move item forward
 */
export const moveItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phaseName, itemIds, quantity, type, bulkId, dispatchTo } = req.body;

    // 1. Get current phase
    let { data: currentPhase, error: phaseError } = await supabase
      .from("node_phases")
      .select("*")
      .eq("name", phaseName)
      .single();

    if (phaseError || !currentPhase) {
      return res.status(400).json({
        success: false,
        message: `Phase "${phaseName}" not found.`,
      });
    }

    // 2. Get next phase
    let nextPhase;
    if (dispatchTo) {
      ({ data: nextPhase, error: phaseError } = await supabase
        .from("node_phases")
        .select("*")
        .eq("name", dispatchTo)
        .single());
    } else {
      ({ data: nextPhase, error: phaseError } = await supabase
        .from("node_phases")
        .select("*")
        .eq("order", currentPhase.order + 1)
        .single());
    }

    if (phaseError || !nextPhase) {
      return res.status(400).json({
        success: false,
        message: `No next phase found after "${phaseName}".`,
      });
    }

    // 3. Get bulk item
    let { data: bulkItems, error: bulkError } = await supabase
      .from("node_bulk_items")
      .select("*")
      .eq("id", bulkId)
      .eq("phase_id", currentPhase.id)
      .single();

    if (bulkError || !bulkItems) {
      return res.status(404).json({
        success: false,
        message: `No bulk item found for phase "${phaseName}".`,
      });
    }

    // 4. Fetch pending items
    let { data: pendingItems } = await supabase
      .from("node_bulk_item_pending")
      .select("item_id")
      .eq("bulk_item_id", bulkId);

    pendingItems = pendingItems.map((i) => i.item_id);

    let selectedItems = [];

    if (type === "quantity") {
      if (!quantity || quantity <= 0 || pendingItems.length < quantity) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity or not enough pending items.",
        });
      }

      selectedItems = pendingItems.slice(0, quantity);
    } else if (type === "itemId" && Array.isArray(itemIds)) {
      const invalidItemIds = itemIds.filter((id) => !pendingItems.includes(id));
      if (invalidItemIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `The following itemIds are not in pending: ${invalidItemIds.join(
            ", "
          )}`,
        });
      }
      selectedItems = itemIds;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid operation type. Use 'quantity' or 'itemId'.",
      });
    }

    // 5. Move items from pending → completed
    for (const itemId of selectedItems) {
      // Remove from pending
      await supabase
        .from("node_bulk_item_pending")
        .delete()
        .match({ bulk_item_id: bulkId, item_id: itemId });

      // Add to completed
      await supabase
        .from("node_bulk_item_completed")
        .insert([{ bulk_item_id: bulkId, item_id: itemId }]);

      // Update item status
      await supabase
        .from("node_items")
        .update({ status: "COMPLETED" })
        .eq("id", itemId);
    }

    // 6. Determine new status for bulk item
    const remainingPendingCount = pendingItems.length - selectedItems.length;
    let newBulkStatus = "IN_PROGRESS";
    if (remainingPendingCount === 0) {
      newBulkStatus =
        bulkItems.status === "RETURNED" ? "RETURNED_COMPLETED" : "COMPLETED";
    }

    await supabase
      .from("node_bulk_items")
      .update({ status: newBulkStatus })
      .eq("id", bulkId);

    // 7. Create new BulkItem for next phase
    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const { data: newBulk, error: newBulkError } = await supabase
      .from("node_bulk_items")
      .insert([
        {
          phase_id: nextPhase.id,
          status: "IN_PROGRESS",
          images: [...(bulkItems.images || []), ...imagePaths],
          created_by: userId,
        },
      ])
      .select()
      .single();

    // Add selected items to pending of new bulk
    for (const itemId of selectedItems) {
      await supabase
        .from("node_bulk_item_pending")
        .insert([{ bulk_item_id: newBulk.id, item_id: itemId }]);
    }

    return res.status(200).json({
      success: true,
      message: `Items successfully moved to next phase: ${nextPhase.name}`,
      data: selectedItems,
    });
  } catch (err) {
    console.error("Error moving items:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Failed to move items.",
      error: err.message,
    });
  }
};

/**
 * Move item backward to an earlier phase
 */
export const moveItemBackward = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phaseName, itemIds, quantity, type, bulkId, toPhase } = req.body;

    // 1. Get current phase and target phase
    const { data: currentPhase, error: currentError } = await supabase
      .from("node_phases")
      .select("*")
      .eq("name", phaseName)
      .single();

    const { data: targetPhase, error: targetError } = await supabase
      .from("node_phases")
      .select("*")
      .eq("name", toPhase)
      .single();

    if (currentError || targetError || !currentPhase || !targetPhase) {
      return res.status(400).json({
        success: false,
        message: "Invalid current or target phase.",
      });
    }

    if (targetPhase.order >= currentPhase.order) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot move to the same or later phase. 'toPhase' must be earlier.",
      });
    }

    // 2. Fetch bulk item for current phase
    const { data: currentBulkItem, error: bulkError } = await supabase
      .from("node_bulk_items")
      .select("*")
      .eq("id", bulkId)
      .eq("phase_id", currentPhase.id)
      .single();

    if (bulkError || !currentBulkItem) {
      return res.status(404).json({
        success: false,
        message: `Bulk item not found in phase "${phaseName}".`,
      });
    }

    // 3. Fetch pending items of the bulk
    let { data: pendingItems } = await supabase
      .from("node_bulk_item_pending")
      .select("item_id")
      .eq("bulk_item_id", bulkId);

    pendingItems = pendingItems.map((i) => i.item_id);

    let selectedItems = [];

    // 4. Select items to move backward
    if (type === "quantity") {
      if (!quantity || quantity <= 0 || pendingItems.length < quantity) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity or not enough items to move backward.",
        });
      }
      selectedItems = pendingItems.slice(0, quantity);
    } else if (type === "itemId" && Array.isArray(itemIds)) {
      const invalidItemIds = itemIds.filter((id) => !pendingItems.includes(id));
      if (invalidItemIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `The following itemIds are not in pending: ${invalidItemIds.join(
            ", "
          )}`,
        });
      }
      selectedItems = itemIds;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid operation type. Use 'quantity' or 'itemId'.",
      });
    }

    // 5. Remove selected items from current bulk's pending
    await supabase
      .from("node_bulk_item_pending")
      .delete()
      .in("item_id", selectedItems)
      .eq("bulk_item_id", bulkId);

    // 6. Update current bulk status if needed
    const remainingPending = pendingItems.length - selectedItems.length;
    const newCurrentStatus =
      remainingPending === 0 && currentBulkItem.status !== "RETURNED"
        ? "COMPLETED"
        : currentBulkItem.status;

    await supabase
      .from("node_bulk_items")
      .update({ status: newCurrentStatus })
      .eq("id", bulkId);

    // 7. Get uploaded images
    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    // 8. Create or fetch target bulk item for backward movement
    let { data: targetBulk } = await supabase
      .from("node_bulk_items")
      .select("*")
      .eq("phase_id", targetPhase.id)
      .eq("status", "RETURNED")
      .limit(1)
      .single();

    if (!targetBulk) {
      const { data: newTargetBulk } = await supabase
        .from("node_bulk_items")
        .insert([
          {
            phase_id: targetPhase.id,
            status: "RETURNED",
            created_by: userId,
            images: [...(currentBulkItem.images || []), ...imagePaths],
          },
        ])
        .select()
        .single();
      targetBulk = newTargetBulk;
    }

    // 9. Add selected items to target bulk pending
    const insertRows = selectedItems.map((itemId) => ({
      bulk_item_id: targetBulk.id,
      item_id: itemId,
    }));

    await supabase.from("node_bulk_item_pending").insert(insertRows);

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
      error: err.message,
    });
  }
};
