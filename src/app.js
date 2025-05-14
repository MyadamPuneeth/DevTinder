const { error } = require('console');
const express = require('express');
const app = express();
const db = require('./config/database.js');
const User = require('./models/user.js');  
const {ValidateSignUp, ValidateLogin} = require("./utils/validations.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const CookieParser = require('cookie-parser');
const user = require('./models/user.js');
const {userAuth} = require('./middleware/auth.js')
app.use(CookieParser())
app.use(express.json())

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body
        ValidateLogin(req);

        const user = await User.findOne({emailId: emailId})
        if(!user){
            throw new Error("Invalid Creds")
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword){
            throw new Error("Invalid Creds");
        }
        const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn: "1h"});
        console.log(token);
        res.cookie("token", token);
        res.send("User Logged in!!");
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    console.log(userEmail);
    try{
        const user = await User.find({emailId: userEmail});
        console.log(user);
        res.send(user);
    }
    catch (err){
        res.status(400).send("Some error has occured");
    }
});

app.get("/feed", async (req, res) => {
    try{
        const user = await User.find({});
        console.log(user);
        res.send(user);
    }
    catch (err){
        res.status(400).send("Some error has occured");
    }
});

app.delete("/user", async (req, res) => {
    const userid = await req.body.userId
    try{
        await User.findByIdAndDelete(userid)
        res.send("Bayya user deleted");
    } 
    catch (err){
        res.status(400).send("Some error has occured");
    }
});

app.patch("/user", async (req,res) => {
    const data = req.body;
    const userId = req.body.userid;
    try{
        const ALLOWED_UPDATES = [
            "userid",
            "age",
            "gender",
            "skills"
        ]

        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        )   

        if (!isUpdateAllowed){
            throw new Error ("Update not allowed")
        }

        await User.findByIdAndUpdate(userId,data,{
            returnDocument:"before",
            runValidators: true
        })
        res.send("Patch up hogaya")
    }
    catch (err){
        res.status(400).send("Bayya problem "+err)
    }
});

app.get("/profile", userAuth, async (req, res) => {

    try{
    const user = req.user; 
    res.send(user);
    }
    catch(err){
        res.status(400).send("Error: "+ err.message)
    }
});

db() 
    .then(() => {
        console.log("Database connection establish...");
        app.listen(3000, () => {
            console.log("Server is listening....");
    });
        
    })
    .catch((err) => {
        console.error("Couldn't connect to you db");
    });

