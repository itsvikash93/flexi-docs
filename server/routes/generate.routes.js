const express = require("express");
const multer = require("multer");
// const upload = multer();
const upload = require("../middlewares/multerSetup.js");

const {
  docGenerate,
  imgGenerate,
  // workshopGenerate,
  iicActivityReportGenerate,
  departmentalActivityReportGenerate,
  nspReportGenerate,
  testingController,
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

router.post(
  "/testing",
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "qSheet", maxCount: 1 },
    { name: "notice", maxCount: 1 },
    { name: "glimpses", maxCount: 10 },
    { name: "attendances", maxCount: 10 },
    { name: "participants", maxCount: 10 },
    { name: "feedbackAnalysis", maxCount: 10 },
  ]),
  testingController
);

module.exports = router;
