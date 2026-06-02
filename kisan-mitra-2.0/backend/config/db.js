const mongoose = require('mongoose');
const connectDB = async () => { 
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 }) 
};
module.exports = { connectDB }