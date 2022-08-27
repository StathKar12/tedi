const express = require('express');
const { validT } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Bids,Users,Location} = require("../models");

router.get("/", async (req, res) => {
    const listOfBids = await Bids.findAll();
    res.json(listOfBids);
});

router.get('/byid/:id',async (req, res) =>{
    const id = req.params.id;
    const bids = await Bids.findAll({where :{ AuctionId:id }})
    const users= await Users.findAll();
    const locations =await Location.findAll();

    bids.some((element,index) => {
        locations.some((element2)=>{
            if(element.UserId===element2.UserId){
                bids[index].dataValues.BidderLocation=element2.Location;
                bids[index].dataValues.BidderCountry=element2.Country;
                return true;
            }
        });
        users.some((element2)=>{
            if(element.UserId===element2.id){
                bids[index].dataValues.Bidder=element2.username;
                bids[index].dataValues.BidderRating=element2.Rating;

                return true;
            }
        });
    });
    res.json(bids)
})


router.post("/",validT, async (req, res) => {
    biduser=res.userId.id
    if (biduser===req.body.Seller){
        return res.json({error: "You cant bid on your own Auction !!!"})
    }
    const bid = req.body;
    req.body.UserId=biduser;
    var re;
    try{
        re=await Bids.create(bid);
    }
    catch(err){
        console.log(err);
    }
    res.json(re);
});

module.exports = router;