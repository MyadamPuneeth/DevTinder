const { error } = require('console');
const express = require('express');
const app = express();
const db = require('./config/database.js');
const CookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(CookieParser())
app.use(express.json())

const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require('./routes/user.js')

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

db() 
    .then(() => {
        console.log("Database connection establish...");
        app.listen(process.env.PORT, () => {
            console.log("Server is listening....");
    });
        
    })
    .catch((err) => {
        console.error("Couldn't connect to you db");
    });

