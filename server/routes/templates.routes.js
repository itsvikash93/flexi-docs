const express = require('express');
const { uploadTemplate, getTemplates } = require('../controllers/templates.controller');
const router = express.Router();

router.post('/', uploadTemplate);
router.get("/", getTemplates);

module.exports = router;