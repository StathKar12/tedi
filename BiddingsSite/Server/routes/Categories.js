const express = require('express');
const router = express.Router();
const { Categories } = require("../models");
const { validT } = require('../middlewares/authMiddleware');

router.get("/", async (req, res) => {
    const listOfCategories = await Categories.findAll();
    res.json(listOfCategories);
});

router.post("/",validT, async (req, res) => {
    const category = req.body;
    await Categories.create(category);
    res.json(category);
});


router.get("/byid/:id",validT, async (req, res) => {
    Id=req.params.id;
    const listOfCategories = await Categories.findAll({where:{AuctionId:Id}});
    res.json(listOfCategories);
});

module.exports = router;