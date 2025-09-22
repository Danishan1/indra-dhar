import { supabase } from "../config/db.js";

/**
 * Insert multiple POs into Kora phase
 */
export const newPO = async (req, res) => {
  try {
    const _poList = req.body; // Expecting an array of POs
    const poList = [_poList];

    if (!Array.isArray(poList) || poList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array.",
      });
    }

    // 1. Find Kora phase once
    const { data: koraPhase, error: koraError } = await supabase
      .from("node_phases")
      .select("id")
      .eq("name", "Kora")
      .single();

    if (koraError || !koraPhase) {
      return res.status(400).json({
        success: false,
        message: "Kora phase not found.",
      });
    }

    // let results = [];

    // 2. Loop through each PO entry
    for (const po of poList) {
      const { sampleId, buyer_purchase_orders, orderReceivingDetails } = po;

      const po_id = buyer_purchase_orders.merchandiser;
      const orderDetails = orderReceivingDetails;

      let quantity = null;
      if (orderDetails && orderDetails.length > 0) {
        const lastEntry = orderDetails[orderDetails.length - 1]; // ✅ last element
        // Parse JSON string into object
        const parsed =
          typeof lastEntry === "string" ? JSON.parse(lastEntry) : lastEntry;
        quantity = parsed.qty;
      }

      const { data: imageData, error: imageError } = await supabase
        .from("sample_development")
        .select("image_url")
        .eq("id", sampleId)
        .single();

      if (imageError) throw bulkError;

      // 2.1 Create a new bulk item for this PO
      const { data: bulkItem, error: bulkError } = await supabase
        .from("node_bulk_items")
        .insert([
          {
            phase_id: koraPhase.id,
            status: "IN_PROGRESS",
            pending_count: parseInt(quantity),
            completed_count: 0,
            sample_id: sampleId,
            created_by: po_id,
            images: [imageData.image_url],
            from_phase: "PO",
          },
        ])
        .select()
        .single();

      if (bulkError) throw bulkError;

      // // 2.2 Create node items for ordered quantity
      // let itemIds = [];
      // for (let i = 0; i < Number(orderedQuantity); i++) {
      //   const { data: newItem, error: itemError } = await supabase
      //     .from("node_items")
      //     .insert([
      //       {
      //         phase_id: koraPhase.id,
      //         item_detail_id: sampleId,
      //         status: "IN_PROGRESS",
      //         history: [`Created in Kora by ${created_by}`],
      //       },
      //     ])
      //     .select()
      //     .single();

      //   if (itemError) throw itemError;
      //   itemIds.push(newItem.id);

      //   // Add item to bulk pending
      //   await supabase
      //     .from("node_bulk_item_pending")
      //     .insert([{ bulk_item_id: bulkItem.id, item_id: newItem.id }]);
      // }

      //   // 2.3 Collect response for this PO
      //   results.push({
      //     buyer_ref,
      //     buyer_PO_No,
      //     our_PO_No,
      //     deliveryDate,
      //     deliveryAddress,
      //     merchandiser,
      //     created_by,
      //     sampleId,
      //     orderedQuantity,
      //     price,
      //     bulkItem,
      //   });
    }

    // 3. Send response for all POs
    return res.status(201).json({
      success: true,
      message: "PO(s) added successfully into Kora phase.",
      data: {},
    });
  } catch (err) {
    console.error("Error creating POs:", err);
    return res.status(500).json({
      success: false,
      message: "Server error. Failed to create POs.",
      error: err.message,
    });
  }
};
