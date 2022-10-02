//Require :
const express = require('express');
const db = require("./models");
const { Users,Location ,Auctions,Categories,Bids} = require("./models");
const bcrypt = require("bcrypt");
const cors = require("cors");
const https =require('https');
const fs =require('fs');
const path = require('path');
const app = express();
const port = 8080;
var parser = require('xml2json');

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

const UserMessaging = require("./routes/Messaging");
app.use("/Messaging", UserMessaging);

const HistoryRouter = require("./routes/History");
app.use("/History", HistoryRouter);

const is_undefined=((data)=>{
    if(typeof data.length ==="undefined"){
        return " "
    }
    else return data;
})
const options =
 [  
    "Tech",
    "Electronics",
    "Fashion",
    "Health & Beauty",
    "Home & Gsarden",
    "Art",
    "Motors" ,
    "Industrial equipment"
  ];
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
            },{logging: false}).then(()=>{
                Location.create({Country:"AdminCountry",Location:"AdminLocation",UserId:1},{logging: false})        
            })
        
        const directoryPath = path.join(__dirname, 'ebay-data');
        fs.readdir(directoryPath, function (err, files) {

            if (err) {
                console.log('Unable to scan directory: ' + err);
            } 
            var index_id=2
            files.forEach(function (file) {
                bcrypt.hash("datasetuser", 10).then((hashpass)=>{
                    fs.readFile( directoryPath+"/"+file, function(err, data) {

                        var json = parser.toJson(data)
                        json_items=JSON.parse(json)
                            
                        json_items.Items.Item.some((json)=>
                        {
                            if(is_undefined(json.Description).length>3000)return;
                            var Auction={
                                id:json.ItemID,
                                Name:json.Name,
                                Currently:json.Currently.replace("$",""),
                                First_Bid:json.First_Bid.replace("$",""),
                                Number_of_Bids:json.Number_of_Bids,
                                Started:json.Started.replace(" ","T").replace("Dec","2022").slice(0, -3),
                                Ends:json.Ends.replace(" ","T").replace("Dec","2023").slice(0, -3),
                                UserId:index_id,
                                Description:is_undefined(json.Description),
                                Active:1,
                            }
                            
                            if(typeof json.Buy_Price !== "undefined"){
                                Auction.Buy_Price=json.Buy_Price.replace("$","");
                            }
                            
                            const category={
                                CategoryName: options[Math.floor(Math.random() * 8)],
                                AuctionId:json.ItemID
                            }
                            const Seller={
                                id:index_id,
                                username:json.Seller.UserID,
                                Rating:json.Seller.Rating,
                                Active:0,
                                Name: "DataSetUser",
                                LastName:"DataSetUser",
                                AFM:1234567,
                                Email:"datasetUser@gmail.com",
                                Phone:1234567,
                                password:hashpass
                            }
                            var loc;
                            if(typeof json.Location['$t'] ==="undefined")
                            {
                                loc=json.Location;
                            }
                            else{
                                loc=json.Location['$t']
                            }
                            const Auclocation={
                                Country:json.Country,
                                Location:loc,
                                Latitude:0,
                                Longtitude:0,
                                AuctionId:json.ItemID
                            }
                            if(typeof json.Location.Latitude !== "undefined" && typeof json.Location.Longitude !== "undefined"){
                                Auclocation.Latitude=json.Location.Latitude;
                                Auclocation.Longtitude=json.Location.Longitude;
                            }

                            const SellerLoc={
                                UserId:index_id,
                                Location:"DataSetLoc",
                                Country:"DataSetCou",
                            }
                            
                            index_id+=1;
                            let bidderlist=[]
                            let bidlist=[]
                            let biduserloclist=[]
                            if(typeof json.Bids.Bid!=="undefined"){
                                if(typeof json.Bids.Bid.Bidder!=="undefined")
                                    json.Bids.Bid=Array(json.Bids.Bid);
                                
                                json.Bids.Bid.some((elem)=>{
                
                                    const bidder={
                                        id:index_id,
                                        username:elem.Bidder.UserID,
                                        Rating:elem.Bidder.Rating,
                                        Active:0,
                                        Name: "DataSetUser",
                                        LastName:"DataSetUser",
                                        AFM:1234567,
                                        Email:"datasetUser@gmail.com",
                                        Phone:1234567,
                                        password:hashpass
                                    }
                                    bidderlist.push(bidder);
                                    const elem_bid={
                                        UserId:index_id,
                                        Time:elem.Time.replace(" ","T").replace("Dec","2023").slice(0, -3),
                                        Amount:elem.Amount.replace("$",""),
                                        AuctionId:json.ItemID
                                    }
                                    bidlist.push(elem_bid);
                                    const biduserLoc={
                                        UserId:index_id,
                                        Location:"DataSetLoc",
                                        Country:"DataSetCou",
                                    }
                                    biduserloclist.push(biduserLoc)
                                    index_id+=1;
                                })
                            }
                            Users.create(Seller,{logging: false}).then(()=>{
                                Location.create(SellerLoc,{logging: false});
                                Auctions.create(Auction,{logging: false}).then(()=>{
                                    Categories.create(category,{logging: false});
                                    Location.create(Auclocation,{logging: false});
                                    if(bidlist.length>0){
                                        Users.bulkCreate(bidderlist,{logging: false}).then(()=>{
                                            Location.bulkCreate(biduserloclist,{logging: false});
                                            Bids.bulkCreate(bidlist,{logging: false});
                
                                        })                                                
                                    }
                                })
                            })
                        })
                    });
                })
                
            });
        });    
        
    })
    }).then(()=>{
        const sslS=https.createServer({
            key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
            cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
        },app)
        sslS.listen(port,()=>
        {
            console.log("Listening on port : ",port);
    
        })
    })
})
.catch(err=>
{
    console.error("\nDatabase Error or Listener Error: \n",err)
});
