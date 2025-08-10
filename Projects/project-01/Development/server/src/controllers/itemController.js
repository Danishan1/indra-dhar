// controllers/item.controller.js
import { Item } from "../models/Item.js";
import { ReturnRequest } from "../models/ReturnRequest.js";
import mongoose from "mongoose";

/**
 * Create single or bulk items
 */
export const createItem = async (req, res) => {
  try {
    const {
      isBulkCountBased,
      quantity,
      trackingId,
      bulkGroupId,
      formData,
      templateId,
      images,
    } = req.body;

    const tenantId = req.user.tenantId; // from auth middleware

    if (isBulkCountBased) {
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: "Quantity must be > 0" });
      }
      // Create bulk as count-based
      const bulkItems = [];
      for (let i = 0; i < quantity; i++) {
        bulkItems.push({
          tenantId,
          trackingId: `${bulkGroupId}-${i + 1}`,
          templateId,
          formData,
          currentPhaseId: null,
          images,
        });
      }
      await Item.insertMany(bulkItems);
      return res
        .status(201)
        .json({ message: "Bulk items created", count: quantity });
    } else {
      if (!trackingId)
        return res.status(400).json({ error: "Tracking ID required" });
      const item = await Item.create({
        tenantId,
        trackingId,
        templateId,
        formData,
        currentPhaseId: null,
        images,
      });
      return res.status(201).json(item);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get all items with filters
 */
export const listItems = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { phaseId, status, bulkGroupId } = req.query;

    const filter = { tenantId };
    if (phaseId) filter.currentPhaseId = phaseId;
    if (status) filter.status = status;
    if (bulkGroupId) filter.trackingId = new RegExp(`^${bulkGroupId}`);

    const items = await Item.find(filter).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
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
