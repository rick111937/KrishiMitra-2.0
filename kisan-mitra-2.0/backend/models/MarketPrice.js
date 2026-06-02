const mongoose = require('mongoose');
const MarketPriceSchema = new mongoose.Schema({});
module.exports = mongoose.model('MarketPrice', MarketPriceSchema)