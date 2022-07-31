//Require :
const express = require('express');
const db = require("./models");


const app = express();
const port = 8080;

db.sequelize.sync().then(() =>
{ 
    app.listen(port,()=>
    {
        console.log("Listening on port : ",port);
    })
})
.catch(err=>
{
    console.error("\nDatabase Error or Listener Error: \n",err)
})


