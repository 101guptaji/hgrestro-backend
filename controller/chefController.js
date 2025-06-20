const Chef = require('../models/Chef')

// Get all chefs
getAllChef = async (req, res) =>{
    try {
        const chef = await Chef.find();

        res.status(200).json(chef);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get chef data' });
    }
}

module.exports = {
    getAllChef
}