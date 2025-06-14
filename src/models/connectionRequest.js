const mongoose = require('mongoose')

const ConnectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type: String,
        required: true,
        ref: "User"
    },

    toUserId:{
        type:String,
        requried:true,
        ref: "User"
    },

    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "intrested", "accepted", "rejected"],
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