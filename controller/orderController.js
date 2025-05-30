const Order = require('../models/Order');
const Chef = require('../models/Chef');
const Table = require('../models/Table');

// Place a order
postOrder = async (req, res) => {
    try {

        const {
            type, orderTotal, deliveryTime, products, userName, userPhone, deliveryAddress, cookingInstructions
        } = req.body;

        // Generate order ID
        const lastOrder = await Order.findOne().sort({ orderNo: -1 }); // sort in descending order and find 1st record
        const newOrderNo = lastOrder ? lastOrder.orderNo + 1 : 101;

        // Assign a chef with minimum orders
        const selectedChef = await Chef.findOne().sort({ orderTaken: 1, orderTime: 1 });

        // Increment orderTaken count
        selectedChef.orderTaken += 1;
        selectedChef.orderTime += deliveryTime;
        await selectedChef.save();

        // Assign table if dine-in
        let assignedTable = null;
        if (type === 'dineIn') {
            assignedTable = await Table.findOneAndUpdate(
                { isReserved: false },
                { isReserved: true },
                { new: true }
            );
            if (!assignedTable) return res.status(400).json({ message: 'No tables available' });
        }

        //Create order
        const newOrder = new Order({
            orderNo: newOrderNo,
            type,
            deliveryTime,
            products,
            orderTotal,
            userName,
            userPhone,
            deliveryAddress: type === 'takeAway' ? deliveryAddress : null,
            cookingInstructions,
            tableNo: assignedTable?.tableNo || null,
            chefId: selectedChef._id,
        });

        await newOrder.save();

        res.status(201).json({
            orderNo: newOrderNo,
            deliveryTime
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Failed to place order' });
    }
}

// Get orders count
getOrdersAnalytics = async (req, res) => {
    try {
        const orders = await Order.find({}, { orderTotal: 1, userPhone: 1, _id: 0 });
        const totalRevenue = orders.reduce((sum, x) => sum += x.orderTotal, 0);

        res.status(200).json({
            totalOrders: orders.length,
            totalRevenue,
            totalClients: new Set(orders.map(order => order.userPhone)).size
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get orders analytics' });
    }
}

// Get date of n weeks before
function getStartOfNWeek(n) {
    const now = new Date();
    const diff = now.getDate() - 6 * n;
    const start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
}

// Get date of n month before
function getStartOfNMonth(n) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - n, now.getDate());
    start.setHours(0, 0, 0, 0);
    return start;
}

// Get date of n year before
function getStartOfNYear(n) {
    const now = new Date();
    const start = new Date(now.getFullYear() - n, now.getMonth(), now.getDate());
    start.setHours(0, 0, 0, 0);
    return start;
}

getOrderSummary = async (req, res) => {
    try {
        const filter = req.query.filter || 'daily';
        let startDate;

        if (filter === 'yearly') {
            startDate = getStartOfNYear(1);
        }
        else if (filter === 'monthly') {
            startDate = getStartOfNMonth(1);
        }
        else if (filter === 'weekly') {
            startDate = getStartOfNWeek(1);
        }
        else {
            startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
        }

        const endDate = new Date();

        const matchToday = { timestamp: { $gte: startDate, $lte: endDate } };

        const [dineInCount, takeAwayCount, doneCount] = await Promise.all([
            Order.countDocuments({ ...matchToday, type: 'dineIn' }),
            Order.countDocuments({ ...matchToday, type: 'takeAway' }),
            Order.countDocuments({ ...matchToday, status: 'done' })
        ]);

        res.status(200).json({
            dineInCount, takeAwayCount, doneCount
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get order summery' });
    }
}


getRevenueByDay = async (req, res) => {
    try {
        const startDate = getStartOfNWeek(1);
        const endDate = new Date();

        let revenueData = await Order.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        dayOfWeek: { $dayOfWeek: "$timestamp" } // 1 = Sun and 7 = Sat
                    },
                    totalRevenue: { $sum: "$orderTotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    dayOfWeek: "$_id.dayOfWeek",
                    totalRevenue: "$totalRevenue"
                }
            },
            {
                $sort: {
                    "dayOfWeek": 1,
                }
            }
        ]);

        // console.log(revenueData);

        // Initialize result
        let result = [];

        const dayMap = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };

        const init = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        result = init.map(label => ({ label, revenue: 0 }));
        
        revenueData.forEach(({dayOfWeek, totalRevenue }) => {
            const label = dayMap[dayOfWeek];
            for (let entry of result) {
                if (entry.label === label) {
                    entry.revenue = totalRevenue;
                }
            }
        });

        // console.log(result);

        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get revenue data' });
    }
}

getRevenueByWeek = async (req, res) => {
    try {
        const startDate = getStartOfNWeek(7);
        const endDate = new Date();

        let revenueData = await Order.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $isoWeekYear: "$timestamp" },
                        week: { $isoWeek: "$timestamp" }
                    },
                    totalRevenue: { $sum: "$orderTotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    week: "$_id.week",
                    totalRevenue: "$totalRevenue"
                }
            },
            {
                $sort: {
                    "year": 1,
                    "week": 1
                }
            }
        ]);

        // console.log(revenueData);

        const result = [];

        // Fill last 7 weeks with 0 revenue
        for (let i = 6; i >= 0; i--) {
            result.push({ label: `W-${i}`, revenue: 0 })
        }

        const currWeekNo = getISOWeekNumber(new Date());

        // inserting actual revenue data
        revenueData.forEach(({week, totalRevenue }) => {
            let newWeek = currWeekNo - week;

            for (let entry of result) {
                if (entry.label === `W-${newWeek}`) {
                    entry.revenue = totalRevenue;
                }
            }
        })

        // console.log(result)

        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get revenue data' });
    }
}

function getISOWeekNumber(date) {
    const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
}

getRevenueByMonth = async (req, res) => {
    try {
        const startDate = getStartOfNMonth(7);
        const endDate = new Date();

        let revenueData = await Order.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" }
                    },
                    totalRevenue: { $sum: "$orderTotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    totalRevenue: "$totalRevenue"
                }
            },
            {
                $sort: {
                    "year": 1,
                    "month": 1
                }
            }
        ]);

        // console.log(revenueData);

        // Fill all 7 months 0 revenue
        const result = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = date.toLocaleString('default', { month: 'short'});
            result.push({ label, revenue: 0 });
        }

        // inserting revenue into result
        revenueData.forEach(({ year, month, totalRevenue }) => {
            const date = new Date(year, month - 1, 1);
            const label = date.toLocaleString('default', { month: 'short'});

            for (let entry of result) {
                if (entry.label === label) {
                    entry.revenue = totalRevenue;
                }
            }
        });
        // console.log(result)

        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get revenue data' });
    }
}

getRevenueByYear = async (req, res) => {
    try {
        const startDate = getStartOfNYear(7);
        const endDate = new Date();

        let revenueData = await Order.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                    },
                    totalRevenue: { $sum: "$orderTotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    totalRevenue: "$totalRevenue"
                }
            },
            {
                $sort: {
                    "year": 1,
                }
            }
        ]);

        // console.log(revenueData);

        // Fill all 7 years 0 revenue
        const result = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const label = now.getFullYear() - i;
            result.push({ label, revenue: 0 });
        }

        // inserting revenue into result
        revenueData.forEach(({ year, totalRevenue }) => {
            const label = year;

            for (let entry of result) {
                if (entry.label === label) {
                    entry.revenue = totalRevenue;
                }
            }
        });
        // console.log(result)

        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get revenue data' });
    }
}


module.exports = {
    postOrder,
    getOrdersAnalytics,
    getOrderSummary,
    getRevenueByDay,
    getRevenueByWeek,
    getRevenueByMonth,
    getRevenueByYear
}