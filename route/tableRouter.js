const express = require('express');
const router = express.Router();

const {getAllTables} = require('../controller/tableController')

// Get all tables
router.get('/', getAllTables)


module.exports = router;