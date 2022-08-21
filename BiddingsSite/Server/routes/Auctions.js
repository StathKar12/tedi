const e = require('express');
const express = require('express');
const router = express.Router();
const exportFromJSON = require('export-from-json')
const { Auctions ,Files , Categories , Users} = require("../models");
const {validT} = require("../middlewares/authMiddleware");


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

router.get("/", async (req, res) => {
    const listOfAuctions = await Auctions.findAll();
    res.json(listOfAuctions);
})



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

    const usrs =await Users.findByPk(Auction.UserId);
    Auction.dataValues.Seller=usrs.username;
    Auction.dataValues.SellerRating=usrs.Rating;
    res.json(Auction);
})

router.get('/all',async (req, res) =>{
    

    var listofAuctions =[];
    var listofCategories=[];
    
    if(typeof req.query.selected !=="undefined" )
    {
        const categories=req.query.selected;
        let cats=[];
        categories.some((element)=>{
            cats.push(element.replace("{","").replace("}","").split(",")[0].replace('"',"").replace(' "',"").split('":"')[1])
        });
        listofCategories = await Categories.findAll({where:{CategoryName: cats}});
        let auctionids=[];
        listofCategories.some((element)=>{
            auctionids.push(element.AuctionId);
        });
        listofAuctions=await Auctions.findAll({where:{id:auctionids}});
    }
    else{
        listofAuctions= await Auctions.findAll();
    }
    const listofFiles = await Files.findAll();

    
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

    const users= await Users.findAll();

    listofAuctions.some((element,index) => {
        users.some((element2)=>{
            if(element.UserId===element2.id){
                listofAuctions[index].dataValues.Seller=element2.username;
                listofAuctions[index].dataValues.SellerRating=element2.Rating;
                return true;
            }
        });
    });

    res.json(listofAuctions);
})
  

router.post("/",validT, async (req, res) => {
    const auction = req.body;
    req.body.UserId=res.userId.id;
    await Auctions.create(auction).then(result => res.json(result));
});

module.exports = router;



router.post('/update/',validT,async (req, res) =>{
    const UpdateAuction = await Auctions.upsert(req.body);
    res.json(UpdateAuction);
})


// router.get('/AdminDownloadXML/:id',validT,async (req, res) =>{
//     adminid=res.userId.id
//     Id=req.params.id;
//     if(adminid!==1){
//         res.json({error:"You are not an admin"});
//         return;
//     }
//     const auction=await Auctions.findByPk(Id);

//     res.json(auction);
// })
