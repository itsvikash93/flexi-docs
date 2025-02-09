const express = require("express");
const {
  uploadTemplate,
  getTemplates,
  getPresignedURL,
} = require("../controllers/uploads.controller");
const router = express.Router();

router.post("/templates", uploadTemplate);
router.get("/templates", getTemplates);
router.post("/presigned-urls", getPresignedURL);

module.exports = router;
