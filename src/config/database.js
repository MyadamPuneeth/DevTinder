const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://myadampuneeth:puns@puns-cluster.hcud2q1.mongodb.net/DevTinderDB"
    );
};

module.exports = connectDB