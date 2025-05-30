const express = require('express');
const router = express.Router();

const {postOrder, getOrdersAnalytics, getOrderSummary, getRevenueByDay, getRevenueByMonth, getRevenueByYear} = require('../controller/orderController');

// Place a order
router.post('/', postOrder);

// Get orders analytics
router.get('/analytics', getOrdersAnalytics)

// Get order summary by day, week, month and year
router.get('/summary', getOrderSummary)

// Get revenue data based on filters
router.get('/revenueByDay', getRevenueByDay);

router.get('/revenueByWeek', getRevenueByWeek);

router.get('/revenueByMonth', getRevenueByMonth);

router.get('/revenueByYear', getRevenueByYear);

module.exports = router;