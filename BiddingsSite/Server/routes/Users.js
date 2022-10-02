const express = require('express');
const router = express.Router();
const { Users,Location } = require("../models");
const bcrypt = require("bcrypt");
const { validT } = require('../middlewares/authMiddleware');
const {sign} = require ("jsonwebtoken");

router.post("/SignUp", async (req, res) => {
    const userdouble=await Users.findAll({where :{ username:req.body.username}})

    if(userdouble.length>0){
        res.json({error: "Username Already Used Please Choose An Other One"});
        return;
    }

    const {username , password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
            Rating: 0,
            Active: 0,
            Name:req.body.Name,
            LastName:req.body.LastName,
            AFM:req.body.AFM,
            Phone:req.body.Phone,
            Email:req.body.Email,

        }).then((result) =>{
            Location.create({Country:req.body.Country,Location:req.body.Location,UserId:result.dataValues.id}).then(()=>res.json("ALL GOOD BOY"))
        })
    });
});

router.post("/login", async (req, res) => {
    const {username , password} = req.body;

    const user = await Users.findOne({where: {username: username}});
    if(!user){ res.json({error: "Unable to find User"});return;}
    if(!user.Active){
        res.json({error:"Please Wait For Admin Approval"});
        return;
    }
    bcrypt.compare(password, user.password).then((match) => {
        if (!match){ res.json({error: "Wrong Password"});return;}

        const AccT = sign({username: user.username, id: user.id}, "JQ1mFJsoey");
        res.json(AccT);
    });
});

router.get("/Active",validT, async (req, res) => {
    res.json(res.userId.id);
});

router.get("/AdminGet",validT, async (req, res) => {
    usrid=res.userId.id
    if(usrid!==1){
        res.json({error:"You are not an admin"});
        return;
    }
    let listofUsers= await Users.findAll({attributes: ['id', 'username','Active','Name','LastName'],});
    res.json(listofUsers);
});


router.get("/AdminGet/:id",validT, async (req, res) => {
    adminid=res.userId.id
    if(adminid!==1){
        res.json({error:"You are not an admin"});
        return;
    }
    const Id = req.params.id;
    let User= await Users.findAll({where:{id:Id},attributes: ['id', 'username','Active','Name','LastName','Phone','Email','AFM'],}); 
    let loc= await Location.findAll({where:{UserId:Id}});

    User[0].dataValues.Country=loc[0].dataValues.Country;
    User[0].dataValues.Location=loc[0].dataValues.Location;
    res.json(User[0]);
});

router.post('/AdminApprove/:id',validT,async (req, res) =>{
    adminid=res.userId.id
    if(adminid!==1){
        res.json({error:"You are not an admin"});
        return;
    }
    const UpdateUser = await Users.update({Active:req.body.Active},{ where: { id: req.body.id } },{logging: false});
    res.json(UpdateUser);
})

router.post('/AdminDelete/:id',validT,async (req, res) =>{
    adminid=res.userId.id
    if(adminid!==1){
        res.json({error:"You are not an admin"});
        return;
    }
    const UpdateUser = await Users.destroy({where: { id: req.body.id },});

    res.json(UpdateUser);
})


module.exports = router;