const express = require('express');

const requestRouter = express.Router()
const User = require('../models/user.js'); 
const { userAuth } = require('../middleware/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js");
const user = require('../models/user.js');

requestRouter.post("/request/send/:status/:toUserId",
    userAuth,
    async (req,res) => {
        try{
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;
            
            const validStatus = ['intrested','ignored']

            if (!validStatus.includes(status)){
                throw new Error("Not a valid status");
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });

            const ifRequestExists = await ConnectionRequest.findOne({
                $or: [
                    {fromUserId, toUserId,},
                    {fromUserId: toUserId, toUserId: fromUserId}
                ] 
            });

            const ifUserInDb = User.findById(toUserId);
            if (!ifUserInDb){
                res.status(404).json({
                    message:"User not found"
                });
            }

            if (ifRequestExists){
                throw new Error("Duplicate requests not allowed, request already exists")
            };
            
            await connectionRequest.save()
            res.send("Connection req sent "+ connectionRequest)
        }
        catch (err){
            res.status(400).send("Error in sending a request "+err)
        }
    }
);

requestRouter.post("/request/review/:status/:connectionReqId",
    userAuth,
    async (req, res) => {
        try{

            const loggedInUser = req.user
            const status = req.params.status
            const reqId = req.params.connectionReqId

            // validate status
            const validStatus = ['accepted', 'rejected']
            if(!validStatus.includes(status)){
                res.status(400).json({
                    message:"Status can be accepted or rejected nothing else"
                });
            }

            // Validate logged in user
            const validUser = await ConnectionRequest.findOne(
                {
                    _id: reqId,
                    status: 'intrested',
                    toUserId: loggedInUser._id
                }
            );
            if (!validUser){
                res.status(400).json({
                    message: "User not valid"
                })
            }
            
            // save
            validUser.status = status
            validUser.save()
            
            res.json({
                message:"Connection requst "+ status
            })

        }
        catch (err){
            res.status(400).json({
                message: "Invalid request "+err
            });
        }
    }
)

module.exports = requestRouter