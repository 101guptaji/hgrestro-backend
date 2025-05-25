const mongoose = require('mongoose');
const Chef = require('../models/Chef');
const Table = require('../models/Table');

mongoose.connect("mongodb://localhost:27017/hgrestroDB")
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
                { chefId: 1, chefName: "Chef Manish", orderTaken: 0 },
                { chefId: 2, chefName: "Chef Pritam", orderTaken: 0 },
                { chefId: 3, chefName: "Chef Yash", orderTaken: 0 },
                { chefId: 4, chefName: "Chef Tarzan", orderTaken: 0 }
            ];

            await Chef.insertMany(chefs);
        }

        const table = await Table.findOne();
        if (!table) {
            const tables = [
                { tableNo: 1, tableName: "Table", isReserved: false, numberOfChairs: 3 },
                { tableNo: 2, tableName: "Table", isReserved: false, numberOfChairs: 3 },
                { tableNo: 3, tableName: "Table", isReserved: false, numberOfChairs: 3 },
                { tableNo: 4, tableName: "Table", isReserved: false, numberOfChairs: 3 },
                { tableNo: 5, tableName: "Table", isReserved: false, numberOfChairs: 3 },
                { tableNo: 6, tableName: "Table", isReserved: false, numberOfChairs: 3 }
            ];

            await Table.insertMany(tables);
        }

        console.log("✅ Seeding completed!");
    } catch (err) {
        console.error("❌ Error during seeding:", err);
    }
}