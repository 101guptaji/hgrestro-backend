const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNo: { type: Number, unique: true },
  tableName: String,
  isReserved: { type: Boolean, default: false },
  numberOfChairs: { type: Number, default: 3 }
});

module.exports = mongoose.model('Table', tableSchema);
