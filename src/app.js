const { error } = require('console');
const express = require('express');
const app = express();
const db = require('./config/database.js');

app.post("/signup", (req, res) => {
    res.send("User registered in the database");
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

