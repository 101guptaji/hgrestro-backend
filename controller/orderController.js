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

module.exports = {
    postOrder
}