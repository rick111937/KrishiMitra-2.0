const mongoose = require('mongoose');
const CropRiskRecordSchema = new mongoose.Schema({});
module.exports = mongoose.model('CropRiskRecord', CropRiskRecordSchema)