const express = require('express'); 
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { connect } = require('mongoose');
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender about skill photoUrl";
const User = require("../models/user")

userRouter.get("/user/request/pending", userAuth, async (req, res) =>{
try{
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "intrested"
    }).populate(
        'fromUserId', 
        USER_SAFE_DATA);

    res.send(requests);
}
catch (err){
    res.status(400).json({
        message: err.message
    });
}

});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{

        const loggedInUser = req.user;

        const requests = await ConnectionRequest.find({
            $or:[
                {toUserId : loggedInUser._id, status: "accepted"}, 
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        }).populate(
        'fromUserId', 
        USER_SAFE_DATA)
        .populate(
            'toUserId',
            USER_SAFE_DATA
        );
        
        const data = requests.map(row => {
            if(row.fromUserId._id.equals(loggedInUser._id)){
            return row.toUserId
        }
        return row.fromUserId})

        res.send(data)

    }
    catch (err){
        res.status(400).send({message: err.message})
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {

    try{

        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit
        
        const loggedInUser = req.user

        const requests = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        })

        const hideRequests = new Set()

        requests.forEach(request => {
            hideRequests.add(request.toUserId.toString()),
            hideRequests.add(request.fromUserId.toString())
        })

        const feed = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideRequests)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.send(feed)
    }
    catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
});

module.exports = userRouter