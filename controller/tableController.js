const Table = require('../models/Table')

// Get all tables
getAllTables = async (req, res) =>{
    try {
        const tables = await Table.find();

        // console.log(tables)

        res.status(200).json(tables);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get tables data' });
    }
}

module.exports = {
    getAllTables
}