const mongoose = require('mongoose');
const Chef = require('../models/Chef');
const Table = require('../models/Table');
const Order = require('../models/Order');

mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log("Database connected");
        addDummyData();
    })
    .catch((err) => {
        console.log("Error in database connection", err);
    });

async function addDummyData() {
    try {
        // insert dummy chef data if no chef
        const chef = await Chef.findOne();
        if (!chef) {
            const chefs = [
                { chefName: "Chef Manish", orderTaken: 0, orderTime: 0 },
                { chefName: "Chef Pritam", orderTaken: 0, orderTime: 0 },
                { chefName: "Chef Yash", orderTaken: 0, orderTime: 0 },
                { chefName: "Chef Tarzan", orderTaken: 0, orderTime: 0 }
            ];

            await Chef.insertMany(chefs);

            console.log("Dummy Chefs inserted");
        }

        // insert dummy table data if no table
        const table = await Table.findOne();
        if (!table) {
            const tables = []
            for (let i = 1; i <= 30; i++) {
                tables.push({
                    tableNo: i, tableName: "Table", isReserved: false, numberOfChairs: 3
                })
            }

            await Table.insertMany(tables);

            console.log("Dummy Tables inserted");
        }

        // insert dummy order data if no order
        const order = await Order.findOne();
        if (!order) {

            const chefs = await Chef.find();
            const tables = await Table.find();
            let orderIdCounter = 101;

            // sample product template
            const productTemplates = [
                [{ name: "Pizza", quantity: 1, bakingTime: 30, price: 299 }],
                [{ name: "Burger", quantity: 2, bakingTime: 20, price: 149 }],
                [{ name: "French Fries", quantity: 2, bakingTime: 10, price: 99 }],
                [{ name: "Veggie", quantity: 1, bakingTime: 10, price: 89 }, { name: "Drinks", quantity: 1, bakingTime: 10, price: 79 }],
                [{ name: "Pizza", quantity: 1, bakingTime: 30, price: 299 }, { name: "Drinks", quantity: 2, bakingTime: 10, price: 79 }, { name: "Burger", quantity: 2, bakingTime: 20, price: 149 }],
            ];

            for (let i = 0; i < 20; i++) {
                const type = i % 2 === 0 ? "dineIn" : "takeAway";
                const products = productTemplates[i % productTemplates.length];

                // calculating delivery time
                let deliveryTime = 0;
                let orderTotal = 0;
                products.forEach(p => {
                    deliveryTime += p.bakingTime * p.quantity;
                    orderTotal += p.price * p.quantity;
                });

                let status = "processing";

                // finding the chef with minimum orderTaken and minimum orderTime
                chefs.sort((a, b) => {
                    if (a.orderTaken !== b.orderTaken)
                        return a.orderTaken - b.orderTaken;

                    return a.orderTime - b.orderTime;
                });
                const selectedChef = chefs[0];
                selectedChef.orderTaken++;
                selectedChef.orderTime += deliveryTime;

                // Assign table if dine-in
                let assignedTable = null;
                if (type === 'dineIn') {
                    assignedTable = tables.find(t => !t.isReserved);
                    if (assignedTable) {
                        assignedTable.isReserved = true;
                    }
                }

                const order = new Order({
                    orderNo: orderIdCounter++,
                    type,
                    deliveryTime,
                    products,
                    orderTotal,
                    userName: `User ${i + 1}`,
                    userPhone: `98765432${i}${i}`,
                    deliveryAddress: type === 'take away' ? `Street ${i + 1}, City` : null,
                    cookingInstructions: i % 2 === 0 ? "Extra cheese" : "No onions",
                    tableNo: assignedTable?.tableNo || null,
                    chefId: selectedChef._id,
                    status: status,
                    timestamp: new Date(Date.now() - i * 60 * 1000), // Past timestamps for demo
                });

                await order.save();
                await assignedTable.save();
                await selectedChef.save();
            }

            console.log("Dummy Orders inserted");
        }


    } catch (err) {
        console.error("Error inserting dummy data:", err);
    }
}