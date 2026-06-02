const mongoose = require('mongoose');
const WeatherRecordSchema = new mongoose.Schema({});
module.exports = mongoose.model('WeatherRecord', WeatherRecordSchema)