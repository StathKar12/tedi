const express = require('express');
const router = express.Router();
const { Bids } = require("../models");

router.get("/", async (req, res) => {
    const listOfBids = await Bids.findAll();
    res.json(listOfBids);
});

router.post("/", async (req, res) => {
    const bid = req.body;
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