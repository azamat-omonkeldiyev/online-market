const express = require("express");
const {
  createRegion,
  getAllRegions,
  getRegionById,
  updateRegion,
  deleteRegion
} = require("../controller/region.controller");

const router = express.Router();

router.post("/", createRegion);
router.get("/", getAllRegions);
router.get("/:id", getRegionById);
router.put("/:id", updateRegion);
router.delete("/:id", deleteRegion);

module.exports = router;
