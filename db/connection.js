const mongoose = require('mongoose');
const Chef = require('../models/Chef');
const Table = require('../models/Table');
const Order = require('../models/Order');

mongoose.connect(process.env.MONGODB_LOCAL_URL)
    .then(() => {
        console.log("Database connected");
        seedData();
    })
    .catch((err) => {
        console.log("Error in database connection", err);
    });

async function seedData() {
    try {
        // check for any data
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

        const order = await Order.findOne();
        if (!order) {

            const chefs = await Chef.find();
            const tables = await Table.find();
            let orderIdCounter = 101;

            const productTemplates = [
                [{ name: "Pizza", quantity: 1, price: 299 }],
                [{ name: "Burger", quantity: 2, price: 149 }],
                [{ name: "French Fries", quantity: 2, price: 99 }],
                [{ name: "Veggie", quantity: 1, price: 89 }, { name: "Drinks", quantity: 1, price: 79 }],
                [{ name: "Pizza", quantity: 1, price: 299 }, { name: "Drinks", quantity: 2, price: 79 }, { name: "Burger", quantity: 2, price: 149 }],
            ];

            const timeMap = { pizza: 30, burger: 20, veggie: 10, drinks: 10, fries: 10 };

            for (let i = 0; i < 20; i++) {
                const type = i % 2 === 0 ? "dineIn" : "takeAway";
                const products = productTemplates[i % productTemplates.length];

                // Calculate delivery time
                let deliveryTime = 0;
                let orderTotal = 0;
                products.forEach(p => {
                    const name = p.name.toLowerCase();
                    deliveryTime += (timeMap[name] || 10) * p.quantity;
                    orderTotal += p.price * p.quantity;
                });

                let status = i % 5 === 0 ? "done" : "processing";

                // Find the best chef: min orderTaken, then min orderTime
                chefs.sort((a, b) => {
                    if (a.orderTaken !== b.orderTaken)
                        return a.orderTaken - b.orderTaken;

                    return a.orderTime - b.orderTime;
                });
                const selectedChef = chefs[0];
                selectedChef.orderTaken++;

                if (status !== 'done') {
                    selectedChef.orderTime += deliveryTime;
                }

                let assignedTable = null;
                if (type === 'dineIn') {
                    assignedTable = tables.find(t => !t.isReserved);
                    if (assignedTable && status !== 'done') {
                        assignedTable.isReserved = true;
                        await assignedTable.save();
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
                await selectedChef.save();
            }

            console.log("Dummy Orders inserted");
        }

        
    } catch (err) {
        console.error("Error inserting dummy data:", err);
    }
}