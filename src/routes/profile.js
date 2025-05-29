const express = require('express');
const profileRouter = express.Router()
const User = require('../models/user.js'); 
const {userAuth} = require('../middleware/auth.js');
const {validateEditProfile} = require('../utils/validations.js')

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try{
    const user = req.user; 
    res.send(user);
    }
    catch(err){
        res.status(400).send("Error: "+ err.message)
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
        if (!validateEditProfile(req)){
            throw new Error("Invalid edit request");            
        }

        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();

        res.json({
            message:`${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        });
    }
    catch (err){
        res.status(400).send("Bayya problem "+err)
    }
});

module.exports = profileRouter

