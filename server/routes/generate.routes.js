const express = require("express");
const {
  docGenerate,
  imgGenerate,
  // workshopGenerate,
  iicActivityReportGenerate,
  departmentalActivityReportGenerate,
  nspReportGenerate,
} = require("../controllers/generate.controller");
const router = express.Router();

router.post("/doc-template", docGenerate);
// router.post("/workshop-template", workshopGenerate);
router.post("/iic-activity-report-template", iicActivityReportGenerate);
router.post(
  "/departmental-activity-report-template",
  departmentalActivityReportGenerate
);
router.post("/nsp-report-template", nspReportGenerate);
router.post("/image-template", imgGenerate);

module.exports = router;
