const express = require('express');
const { uploadTemplate } = require('../controllers/templates.controller');
const router = express.Router();

router.post('/', uploadTemplate);

module.exports = router;