const express = require('express');
const router = express.Router();
const { Location } = require("../models");
const { validT } = require('../middlewares/authMiddleware');

router.get("/", async (req, res) => {
    const listOfLocations = await Location.findAll();
    res.json(listOfLocations);
});

router.get('/:id',async (req, res) =>{
    const id = req.params.id;
    const location = await Location.findAll({where :{ AuctionId:id }})
    res.json(location)
  })
  
router.post("/",validT, async (req, res) => {
    const Location_t = req.body;
    await Location.create(Location_t);
    res.json(Location_t);
});

module.exports = router;