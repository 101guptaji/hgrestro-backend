const Table = require('../models/Table')
const Order = require('../models/Order')

// Get all tables
getAllTables = async (req, res) => {
    try {
        const tables = await Table.find().sort({tableNo: 1});

        // console.log(tables)

        res.status(200).json(tables);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Add new table
postTable = async (req, res) => {
    try {
        const table = new Table({
            tableNo: req.body.tableNo,
            tableName: req.body.tableName.trim() || "Table",
            isReserved: false,
            numberOfChairs: req.body.numberOfChairs
        })

        await table.save();

        res.status(201).json({ message: 'Table added' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Delete a table
deleteTable = async (req, res) => {
    try {
        const tableId = req.params.id;

        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Cannot find table' });
        }

        const deletedTableNo = table.tableNo;

        // Delete the table
        await Table.findByIdAndDelete(tableId);

        // Shifting all tables with tableNo > deleted one
        await Table.updateMany(
            { tableNo: { $gt: deletedTableNo } },
            { $inc: { tableNo: -1 } }
        );

        // Decrease tableNo for all orders assigned to tables after the deleted one
        await Order.updateMany(
            { type: 'dineIn', tableNo: { $gt: deletedTableNo } },
            { $inc: { tableNo: -1 } }
        );

        res.status(204).json({ message: 'Table deleted' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllTables,
    postTable,
    deleteTable,
}