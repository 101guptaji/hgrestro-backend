const express = require('express');
const router = express.Router();

const {postOrder} = require('../controller/orderController');

// Place a order
router.post('/', postOrder);

module.exports = router;