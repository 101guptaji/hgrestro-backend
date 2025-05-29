const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNo: { type: Number, unique: true },
  type: { type: String, enum: ['dineIn', 'takeAway'], required: true },
  products: [],
  orderTotal: Number,
  userName: String,
  userPhone: String,
  deliveryAddress: String,
  deliveryTime: Number,
  cookingInstructions: String,
  tableNo: { type: Number, default: null },
  status: { type: String, enum: ['processing', 'served', 'done', 'notPickedUp', 'pickedUp'], default: 'processing' },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  timestamp: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Order', orderSchema);
