const express = require('express');
const router = express.Router();
const { Auctions ,Files} = require("../models");

const getCurrentDate=()=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    }    
    today = yyyy+'-'+mm+'-'+dd+"T"+today.getHours()+":"+(today.getMinutes()<10?'0':'')+today.getMinutes();
    return today;
}
// router.get("/", async (req, res) => {
//     const listOfAuctions = await Auctions.findAll();
//     listOfAuctions.some((element,index) => {
//         if(listOfAuctions[index].dataValues!=null){
//             if(listofAuctions[index].dataValues.Active!==2){
//             var start = (new Date(element.Started.replace(" At: ", "T"))).getTime();
//             var end = (new Date(element.Ends.replace(" At: ", "T"))).getTime();
//             var today = (new Date(getCurrentDate())).getTime();
//             if(today<start)
//             {
//                 listOfAuctions[index].dataValues.Active=0;   //not yet started
//             }
//             else if(today>end)
//             {
//                 listOfAuctions[index].dataValues.Active=-1;  //Expired
//             }
//             else {
//                 listOfAuctions[index].dataValues.Active=1; //Ok
//             }
//         }
//         }
//     });
//     res.json(listOfAuctions);
// });

router.get('/byid/:id',async (req, res) =>{
    const id = req.params.id;
    const Auction = await Auctions.findByPk(id);
    if(Auction!=null ){
        if(Auction.Active!==2){
            var start = (new Date(Auction.Started.replace(" At: ", "T"))).getTime();
            var end = (new Date(Auction.Ends.replace(" At: ", "T"))).getTime();
            var today = (new Date(getCurrentDate())).getTime();
            if(today<start)
            {
                Auction.Active=0;   //not yet started
            }
            else if(today>end)
            {
                Auction.Active=-1;  //Expired
            }
            else{
                Auction.Active=1; //Ok
            }
        }
    }
    if(Auction!=null)await Auctions.update({Active:Auction.Active},{ where: { id: Auction.id } });

    res.json(Auction);
})

router.get('/all',async (req, res) =>{
    
    const listofAuctions = await Auctions.findAll();
    const listofFiles = await Files.findAll();
    const oldlistofFiles=listofAuctions;
    listofAuctions.some((element,index) => {
        listofFiles.some((element2)=>{
            if(element.id===element2.AuctionId){
                listofAuctions[index].dataValues.FileName=element2.FileName
                return true;
            }
        });
        
        if(listofAuctions[index].dataValues!=null){
            if(listofAuctions[index].dataValues.Active!==2){
                var start = (new Date(element.Started.replace(" At: ", "T"))).getTime();
                var end = (new Date(element.Ends.replace(" At: ", "T"))).getTime();
                var today = (new Date(getCurrentDate())).getTime();
                if(today<start)
                {
                    listofAuctions[index].dataValues.Active=0;   //not yet started
                    Auctions.update({Active:0},{ where: { id: listofAuctions[index].dataValues.id } });
                }
                else if(today>end)
                {
                    listofAuctions[index].dataValues.Active=-1;  //Expired
                    Auctions.update({Active:-1},{ where: { id: listofAuctions[index].dataValues.id } });
                }else{
                    listofAuctions[index].dataValues.Active=1;  //ok
                    Auctions.update({Active:-1},{ where: { id: listofAuctions[index].dataValues.id } });
                }
            }
        }
    });
    res.json(listofAuctions);
})
  

router.post("/", async (req, res) => {
    const auction = req.body;
    await Auctions.create(auction).then(result => res.json(result));
});

module.exports = router;



router.post('/update/',async (req, res) =>{
    const UpdateAuction = await Auctions.upsert(req.body);
    res.json(UpdateAuction);
})
