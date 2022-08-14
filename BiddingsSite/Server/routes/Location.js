const express = require('express');
const router = express.Router();
const { Location } = require("../models");

router.get("/", async (req, res) => {
    const listOfLocations = await Location.findAll();
    res.json(listOfLocations);
});

router.post("/", async (req, res) => {
    const Location_t = req.body;
    await Location.create(Location_t);
    res.json(Location_t);
});

module.exports = router;