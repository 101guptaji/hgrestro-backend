const express = require('express');
const router = express.Router();

const { postOrder, getOrdersAnalytics, getOrderSummary, getRevenueByDay, getRevenueByMonth, getRevenueByYear, getAllOrders, updateOrder } = require('../controller/orderController');

// Place a order
router.post('/', postOrder);

// Get all orders
router.get('/', getAllOrders);

// Get update order
router.patch('/:id', updateOrder);

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