const Table = require('../models/Table')

// Get all tables
getAllTables = async (req, res) => {
    try {
        const tables = await Table.find();

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
        const table = await Table.findByIdAndDelete(req.params.id);
        if (!table) {
            return res.status(404).json({ message: 'Cannot find table' });
        }
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