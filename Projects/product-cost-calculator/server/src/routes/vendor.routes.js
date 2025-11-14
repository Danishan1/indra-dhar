// import express from "express";
// import { VendorController as VC } from "../controllers/vendor.controller.js";
// import {
//   createVendorValidator as CVV,
//   updateVendorValidator as UVV,
// } from "../validators/vendor.validator.js";
// import { validateRequest } from "../middlewares/validateRequest.js";

// const router = express.Router();

// router.post("/", CVV, validateRequest, VC.create);
// router.get("/", VC.getAll);
// router.get("/:id", VC.getOne);
// router.put("/:id", UVV, validateRequest, VC.update);
// router.delete("/:id", VC.remove);

// export const vendorRoutes = router;
