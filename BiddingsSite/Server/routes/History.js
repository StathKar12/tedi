const express = require('express');
const router = express.Router();
const { History } = require("../models");
const { validT } = require('../middlewares/authMiddleware');

router.get("/", async (req, res) => {
    const listOfHisroy = await History.findAll();
    res.json(listOfHisroy);
});

router.get('/:id',async (req, res) =>{
    const id = req.params.id;
    const history = await History.findAll({where :{ AuctionId:id }})
    res.json(history)
})
  
router.post("/",validT, async (req, res) => {
    
    const history = await  History.findOrCreate({where:{AuctionId:req.body.AuctionId,UserId:req.body.UserId},logging: false})
    res.json(history);
});

module.exports = router;