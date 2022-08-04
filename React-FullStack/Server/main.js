//Require :
const express = require('express');
const db = require("./models");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

//Routers
const AuctionRouter = require("./routes/Auctions");
app.use("/Auctions", AuctionRouter);

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
});

