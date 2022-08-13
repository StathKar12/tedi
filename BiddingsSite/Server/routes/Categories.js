const express = require('express');
const router = express.Router();
const { Categories } = require("../models");

router.get("/", async (req, res) => {
    const listOfAuctions = await Categories.findAll();
    res.json(listOfAuctions);
});

router.post("/", async (req, res) => {
    const category = req.body;
    await Categories.create(category);
    res.json(category);
});

module.exports = router;