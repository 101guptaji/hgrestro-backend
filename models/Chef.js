const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    chefId: { type: Number, unique: true },
    chefName: String,
    orderTaken: { type: Number, default: 0 }
});

module.exports = mongoose.model("Chef", chefSchema);