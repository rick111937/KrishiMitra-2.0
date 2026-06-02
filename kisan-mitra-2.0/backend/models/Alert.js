const mongoose = require('mongoose');
const AlertSchema = new mongoose.Schema({});
module.exports = mongoose.model('Alert', AlertSchema)