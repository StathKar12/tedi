//Require :
const express = require('express');
const db = require("./models");
const { Users,Location } = require("./models");
const bcrypt = require("bcrypt");
const cors = require("cors");
const https =require('https');
const fs =require('fs');
const path = require('path');
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
const { fstat } = require('fs');
app.use("/Upload", UploadRouter);

db.sequelize.sync().then(() =>
{ 
    Users.findByPk(1).then((res)=>{
        if(res===null)
        bcrypt.hash("password", 10).then((hash) => {
            Users.create({
                id:1,
                username: "admin",
                password: hash,
                Active: 1,
                Rating:0,
                Name: "adminName",
                LastName :"adminLastName",
                AFM: 1, 
                Email:"admin@gmail.com",
                Phone:653211230,
            }).then(()=>{
                Location.create({Country:"AdminCountry",Location:"AdminLocation",UserId:1})
            });
        }); 
    })
    
    const sslS=https.createServer({
        key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
        cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
    },app)
    sslS.listen(port,()=>
    {
        console.log("Listening on port : ",port);
    })
})
.catch(err=>
{
    console.error("\nDatabase Error or Listener Error: \n",err)
});
