const express = require("express");
const {
  docGenerate,
  imgGenerate,
  workshopGenerate,
  iicActivityReportGenerate,
} = require("../controllers/generate.controller");
const router = express.Router();

router.post("/doc-template", docGenerate);
router.post("/workshop-template", workshopGenerate);
router.post("/iic-activity-report-template", iicActivityReportGenerate);
router.post("/image-template", imgGenerate);

module.exports = router;
