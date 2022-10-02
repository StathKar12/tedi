const express = require('express');
const router = express.Router();
const { Messaging } = require("../models");
const { validT } = require('../middlewares/authMiddleware');
const { Op } = require("sequelize");

router.post("/",validT, async (req, res) => {
    req.body.UserId=res.userId.id;
    const message = req.body;
    console.log(req.body);
    await Messaging.create(message).then(result => res.json(result));
});

router.get('/SendMessage/:id',validT,async (req, res) =>{
    const Given_id = req.params.id;
    const usrM =await Messaging.findAll({
        where:{
            [Op.and]: [
                {UserId: Given_id},
                {[Op.or]: [ 
                    {VtoA: Given_id},
                    {VtoR: Given_id}
                ]}
            ]
        },
        order: [
            ["Time_Send","DESC"]
        ]
    });
    res.json(usrM);
})

router.get('/ReceiveMessage/:id',validT,async (req, res) =>{
    const Given_id = req.params.id;
    const usrM =await Messaging.findAll({
        where:{
            [Op.and]: [
                {Send_To: Given_id},
                {[Op.or]: [ 
                    {VtoA: Given_id},
                    {VtoR: Given_id}
                ]}
            ]
        },
        order: [
            ["Time_Send","DESC"]
        ]
    });
    res.json(usrM);
})

router.get('/Message/:id',validT,async (req, res) =>{
    const Given_id = req.params.id;
    const mess =await Messaging.findByPk(Given_id);
    res.json(mess);
})

router.post('/DfA/:id',validT,async (req, res) =>{
    reqId=req.params.id;
    const UpdateMessage = await Messaging.update({VtoA:0},{ where: { id: reqId } },{logging: false});
    res.json(UpdateMessage);
})

router.post('/DfR/:id',validT,async (req, res) =>{
    reqId=req.params.id;
    const UpdateMessage = await Messaging.update({VtoR:0},{ where: { id: reqId } },{logging: false});
    res.json(UpdateMessage);
})

router.post('/ChangeToRead/:id',validT,async (req, res) =>{
    reqId=req.params.id;
    const UpdateMessage = await Messaging.update({Status:1},{ where: { id: reqId } },{logging: false});
    res.json(UpdateMessage);
})

module.exports = router;