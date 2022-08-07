const express = require('express');
const router = express.Router();
const { Auctions } = require("../models");

router.get("/", async (req, res) => {
    const listOfAuctions = await Auctions.findAll();
    res.json(listOfAuctions);
});

router.post("/", async (req, res) => {
    const auction = req.body;
    await Auctions.create(auction);
    res.json(auction);
});

module.exports = router;