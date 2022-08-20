const express = require('express');
const { validT } = require('../middlewares/authMiddleware');
const router = express.Router();
const { Bids,Users } = require("../models");

router.get("/", async (req, res) => {
    const listOfBids = await Bids.findAll();
    res.json(listOfBids);
});

router.get('/byid/:id',async (req, res) =>{
    const id = req.params.id;
    const bids = await Bids.findAll({where :{ AuctionId:id }})
    
    const users= await Users.findAll();

    bids.some((element,index) => {
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
    console.log(bid);
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