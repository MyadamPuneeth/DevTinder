const mongoose = require('mongoose')

const ConnectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: String,
        required: true,
        ref: "User"
    },

    toUserId:{
        type:String,
        requried:true
    },

    status:{
        type:String,
        required:true,
        enum:{
            values:["ignore", "intrested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
    },

},

{timestamps: true}

);


const ConnectionRequestModel = new mongoose.model(
    "connectionRequest",
    ConnectionRequestSchema
)

module.exports = ConnectionRequestModel