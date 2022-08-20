const express = require('express');
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validT } = require('../middlewares/authMiddleware');
const {sign} = require ("jsonwebtoken");

router.post("/SignUp", async (req, res) => {

    const userdouble=await Users.findAll({where :{ username:req.body.username}})
    console.log(userdouble);
    if(userdouble.datavalues!==null){
        console.log("test");
        res.json({error: "Username Already Used Please Choose An Other One"});
        return;
    }
    const {username , password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
        res.json("res");
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

router.get("/Active",validT, async (req, res) => {
    res.json(res.userId.id);
});

module.exports = router;