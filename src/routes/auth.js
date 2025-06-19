const express = require("express")
const authRouter = express.Router();
const {ValidateSignUp, ValidateLogin} = require("../utils/validations.js");
const User = require('../models/user.js'); 
const bcrypt = require('bcrypt')
require('dotenv').config()


authRouter.post("/signup", async (req, res) => {
    try {
        const {firstName, lastName, emailId, password} = req.body

        ValidateSignUp(req)
        const passHash = await bcrypt.hash(password, 10);
        
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passHash
        });

        await user.save();
        res.send("User Registered Sucessfully");
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body
        ValidateLogin(req);

        const user = await User.findOne({emailId: emailId})
        if(!user){
            throw new Error("Invalid Creds")
        }
        const isValidPassword = await user.validatePassword(password)
        if(!isValidPassword){
            throw new Error("Invalid Creds");
        }
        const token = await user.getJWT();
        res.cookie("token", token);
        res.send(user);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res
    .cookie("token", null, {
        expires: new Date(Date.now())
    })
    .send("User Logged out!!!")
});

module.exports = authRouter