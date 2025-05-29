const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    chefName: String,
    orderTaken: { type: Number, default: 0 },
    orderTime: {type: Number, default: 0}
});

module.exports = mongoose.model("Chef", chefSchema);