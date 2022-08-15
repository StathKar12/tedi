const express = require('express');
const router = express.Router();
const { Auctions ,Files} = require("../models");

router.get("/", async (req, res) => {
    const listOfAuctions = await Auctions.findAll();
    res.json(listOfAuctions);
});

router.get('/byid/:id',async (req, res) =>{
    const id = req.params.id;
    const Auction = await Auctions.findByPk(id);
    res.json(Auction);
})

router.get('/all',async (req, res) =>{
    
    const listofAuctions = await Auctions.findAll();
    const listofFiles = await Files.findAll();

    listofAuctions.some((element,index) => {
        listofFiles.some((element2)=>{
            if(element.id===element2.AuctionId){
                listofAuctions[index].dataValues.FileName=element2.FileName
                return true;
            }
        });

    });
    console.log(listofAuctions[0]);
    res.json(listofAuctions);

})
  

router.post("/", async (req, res) => {
    const auction = req.body;
    await Auctions.create(auction).then(result => res.json(result));
});

module.exports = router;