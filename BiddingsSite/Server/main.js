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

const UserRouter = require("./routes/Users");
app.use("/Users", UserRouter);

const CategoryRouter = require("./routes/Categories");
app.use("/Categories", CategoryRouter);

const BidsRouter = require("./routes/Bids");
app.use("/Bids", BidsRouter);

const LocationRouter = require("./routes/Location");
app.use("/Location", LocationRouter);

const UploadRouter = require("./routes/Upload");
app.use("/Upload", UploadRouter);

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


