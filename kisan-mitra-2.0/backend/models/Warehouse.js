const mongoose = require('mongoose');
const WarehouseSchema = new mongoose.Schema({});
module.exports = mongoose.model('Warehouse', WarehouseSchema)