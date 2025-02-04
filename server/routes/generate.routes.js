const express = require('express');
const { docGenerate } = require('../controllers/generate.controller');
const router = express.Router();

router.post('/doc-template', docGenerate);

module.exports = router;