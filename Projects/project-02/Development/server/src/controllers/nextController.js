export const newPO = async (req, res) => {
  console.log("DDDD", req.body);


  res.status(201).json({
    success: true,
    message: "Po Added Successfuly",
    data: {},
  });
};


/*

DDDD [
  {
    buyer_ref: 'B003',
    buyer_PO_No: 'PDOE',
    our_PO_No: 'PO-0003',
    deliveryDate: '2025-09-25T18:29:59.999Z',
    deliveryAddress: 'Chennai Branch',
    merchandiser: 'a6b434f9-ffeb-4575-a421-3139beeddaad',
    created_by: '643f16fb-46be-4e95-87d7-97f63240250e',
    sampleId: 'acdb1b04-a54f-4fac-b0d0-5be4df6db784',
    orderedQuantity: '2000',
    price: '300'
  }
]

*/