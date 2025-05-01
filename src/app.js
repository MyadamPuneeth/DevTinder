const { error } = require('console');
const express = require('express')

const app = express();

app.use("/home",(req, res) => {              //Routing
    res.send("Hello to your home")
});

app.get("/user/:userid", (req, res) => {
    if (req.params.userid == 101){
        res.send({firstname:'Puneeth', lastname: 'Myadam'})
    }
    res.status(400)
    res.send("Invalid User!!!")
    // res.send({userid: req.params.userid,firstname:'Puneeth', lastname: 'Myadam'})
});

app.post("/user", (req, res) => {
    res.send({firstname:Puneeth, lastname: Myadam})
});

app.delete("/user", (req, res) => {
    res.send({firstname:Puneeth, lastname: Myadam})
});

// create a dict

let users = {};
let genUid = 0;

// register using app.post

app.post("/register/:name/:pass", (req, res) => {

    users[genUid] = {name: req.params.name, pass: req.params.pass}
    genUid++
    console.log(users);
    res.send("User Registered")
});

app.get("/login/:uid/:pass", (req,res) => {
    console.log(Object.keys(users));
    console.log(req.params.uid in users);
    if (req.params.uid in users){
        res.send("Wlecome "+users[req.params.uid].name)
    }
    res.send("User Not Found!!!")
});

app.listen(3000, () => {
    console.log("Server is listening....");
});
