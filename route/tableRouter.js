const express = require('express');
const router = express.Router();

const {getAllTables, postTable, deleteTable} = require('../controller/tableController')

// Get all tables
router.get('/', getAllTables)

// Add new table
router.post('/', postTable);

// Delete a table
router.delete('/:id', deleteTable);


module.exports = router;