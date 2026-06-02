const mongoose = require('mongoose');
const SoilRecordSchema = new mongoose.Schema({});
module.exports = mongoose.model('SoilRecord', SoilRecordSchema)