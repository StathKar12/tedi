const express = require('express');
const router = express.Router();
const { Bids } = require("../models");

router.get("/", async (req, res) => {
    const listOfBids = await Bids.findAll();
    res.json(listOfBids);
});

router.post("/", async (req, res) => {
    const bid = req.body;
    await Bids.create(bid);
    res.json(bid);
});

module.exports = router;