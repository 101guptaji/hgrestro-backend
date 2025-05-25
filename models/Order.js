const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: Number, unique: true },
  type: { type: String, enum: ['dineIn', 'takeAway'], required: true },
  deliveryTime: Number,
  products: [],
  orderTotal: Number,
  userName: String,
  userPhone: String,
  deliveryAddress: String,
  cookingInstructions: String,
  tableNo: { type: Number, default: null },
  status: { type: String, enum: ['new', 'processing', 'done'], default: 'new' },
  chefId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  timestamp: { type: Date, default: Date.now },
  ongoingDurationTimer: { type: String, default: "00:00:00" }
});

// Virtual to auto-calculate ongoingDurationTimer until status is 'done'
orderSchema.virtual('duration').get(function () {
  if (this.status !== 'done') {
    const now = new Date();
    const durationMs = now - this.timestamp;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return this.ongoingDurationTimer;
});

module.exports = mongoose.model('Order', orderSchema);
