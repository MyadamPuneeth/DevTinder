const express = require('express')

const app = express();

app.use("/home",(req, res) =>{              //Routing
    res.send("Hello to your home")
});



app.listen(3000, () => {
    console.log("Server is listening....");
});
