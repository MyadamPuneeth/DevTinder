const mongoose = require("mongoose");

const connectDB = async () => {
    console.log(process.env.DB_CONNECTION_SECRECT);
    await mongoose.connect(process.env.DB_CONNECTION_SECRECT);
};

module.exports = connectDB