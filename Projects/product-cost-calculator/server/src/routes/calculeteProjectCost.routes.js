import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  // Placeholder logic for calculating project cost
  const { data } = req.body;
  console.log("Calculating project cost with data:", data);
  res.json({ data });
});

export const calculateProjectCost = router;
