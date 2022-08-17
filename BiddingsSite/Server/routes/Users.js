const express = require('express');
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

const {sign} = require ("jsonwebtoken");

router.post("/", async (req, res) => {
    const {username , password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
        res.json("SUCCESS");
    }); 
});

router.post("/login", async (req, res) => {
    const {username , password} = req.body;

    const user = await Users.findOne({where: {username: username}});
    if(!user) res.json({error: "Unable to find User"});

    bcrypt.compare(password, user.password).then((match) => {
        if (!match) res.json({error: "Wrong Password"});

        const AccT = sign({username: user.username, id: user.id}, "JQ1mFJsoey");
        res.json(AccT);
    });
});

module.exports = router;