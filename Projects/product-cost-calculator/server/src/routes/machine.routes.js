// import express from "express";
// import { MachineController as MC } from "../controllers/machine.controller.js";
// import {
//   createMachineValidator as CMV,
//   updateMachineValidator as UMV,
//   createMachineBulkValidator as CMBV,
// } from "../validators/machine.validator.js";
// import { validateRequest } from "../middlewares/validateRequest.js";
// import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

// const router = express.Router();

// router.post("/", OAM, CMV, validateRequest, MC.create);
// router.get("/", MC.getAll);
// router.get("/:id", MC.getOne);
// router.put("/:id", OAM, UMV, validateRequest, MC.update);
// router.delete("/:id", OAM, MC.remove);
// router.post("/bulk", OAM, CMBV, validateRequest, MC.bulkCreate);

// export const machineRoutes = router;
