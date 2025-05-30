const express = require('express');
const router = express.Router();

const {getAllChef} = require('../controller/chefController')

// Get all chefss
router.get('/', getAllChef)


module.exports = router;