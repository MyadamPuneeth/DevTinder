const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://myadampuneeth:puns@puns-cluster.hcud2q1.mongodb.net/%22"
    );
};

module.exports = connectDB