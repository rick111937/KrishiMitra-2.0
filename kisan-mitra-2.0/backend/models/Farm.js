const mongoose = require('mongoose');
const FarmSchema = new mongoose.Schema({});
module.exports = mongoose.model('Farm', FarmSchema)