const e = require('express');
const math=require('mathjs')
const express = require('express');
const router = express.Router();
const { Auctions ,Files , Categories , Users,Location,History,Bids} = require("../models");
const {validT} = require("../middlewares/authMiddleware");
const arrayColumn = (arr, n) => arr.map((x) => x[n]);

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
    if(Auction!=null)await Auctions.update({Active:Auction.Active},{ where: { id: Auction.id } ,logging: false});

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

    let indexes1=[];
    if(typeof req.query.More!=="undefined" &&req.query.More!=="")
    listofAuctions.some((element,index)=>{
        if(Number(element.Currently)<Number(req.query.More)){
            indexes1.push(index);
        }
    })
    
    indexes1.some((element,index)=>{
        listofAuctions.splice(element-index,1);
    })

    let indexes2=[];
    if(typeof req.query.Less!=="undefined" &&req.query.Less!=="")
    listofAuctions.some((element,index)=>{
        if(Number(element.Currently)>Number(req.query.Less)){
            indexes2.push(index);
        }
    })

    indexes2.some((element,index)=>{
        listofAuctions.splice(element-index,1);
    })

    const listoflocs = await Location.findAll();
    let indexes3=[];
    if(typeof req.query.Loc!=="undefined" &&req.query.Loc!=="")
    listofAuctions.some((element,index)=>{
        listoflocs.some((elem)=>{
            if(elem.AuctionId === element.id)
                if(elem.Location!==req.query.Loc){
                    indexes3.push(index);
                }
        })
    })
    
    indexes3.some((element,index)=>{
        listofAuctions.splice(element-index,1);
    })


    let indexes4=[];
    if(typeof req.query.Desc!=="undefined" &&req.query.Desc!=="")
    listofAuctions.some((element,index)=>{
        if(!element.Description.includes(req.query.Desc)){
            indexes4.push(index);
        }
    })

    indexes4.some((element,index)=>{
        listofAuctions.splice(element-index,1);
    })

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
                    Auctions.update({Active:0},{ where: { id: listofAuctions[index].dataValues.id },logging: false });
                }
                else if(today>end)
                {
                    listofAuctions[index].dataValues.Active=-1;  //Expired
                    Auctions.update({Active:-1},{ where: { id: listofAuctions[index].dataValues.id } ,logging: false});
                }else{
                    listofAuctions[index].dataValues.Active=1;  //ok
                    Auctions.update({Active:1},{ where: { id: listofAuctions[index].dataValues.id } ,logging: false});
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
    const UpdateAuction = await Auctions.upsert(req.body,{logging: false});
    res.json(UpdateAuction);
})


router.post('/Delete/:id',validT,async (req, res) =>{
    reqId=req.params.id;
    const UpdateAuction = await Auctions.destroy({where: { id: reqId },});
    res.json(UpdateAuction);
})


router.post('/Update/byid/:id',validT,async (req, res) =>{
    usrid=res.userId.id
    if(usrid!==req.body.UserId && usrid!==1){
        res.json({error:"Its not Your Auction To Change"});
        return;
    }
    reqId=req.params.id;
    await Auctions.destroy({where: {id:reqId},});
    const auction=req.body;
    await Auctions.create(auction).then(result => res.json(result));
})

const Recom_Auctions=(async(userid)=>{
    userslist = await Users.findAll()
    num_of_users = await Users.count()
    
    User_map = {}

    for(i=0;i<num_of_users;i++){
        User_map[userslist[i].id]=i
    }
    
    Auctionslist = await Auctions.findAll()
    Auctions_count = await Auctions.count()
    rec_num=10
    if (rec_num > Auctions_count)rec_num = Auctions_count;
    
    Auctions_map = {}
    for (i=0;i<Auctions_count;i++){
        Auctions_map[Auctionslist[i].id]=i
    }
    
    let X =[]
    for(i=0;i<num_of_users;i++){
        for(j=0;j<Auctions_count;j++){
            X.push([0,0]);
        }
    }
    
    
    Weighted = []

    visits = await History.findAll({where:{UserId:userid}})
    visits.some((element)=>{
        X[User_map[element.UserId]][Auctions_map[element.AuctionId]] = 2 
        if (!Weighted.includes([User_map[element.UserId], Auctions_map[element.AuctionId]])) {
            Weighted.push([User_map[element.UserId], Auctions_map[element.AuctionId]])
        }
    })        

    bids = await Bids.findAll({where:{UserId:userid}})

    bids.some((element)=>{
        
        if (!Weighted.includes([User_map[element.UserId], Auctions_map[element.AuctionId]])) {
            X[User_map[element.UserId]][Auctions_map[element.AuctionId]] = 5
            Weighted.push([User_map[element.UserId], Auctions_map[element.AuctionId]]);
        }
        else{
            X[User_map[element.UserId]][Auctions_map[element.AuctionId]] = 7
        }
    })        

    let V=[]
    let F=[]
    for(i=0;i<num_of_users;i++){
       let Vinternal=[]
       for(j=0;j<20;j++){
        Vinternal.push(Math.random()*2)
       }
       V.push(Vinternal)
    }
    
    for(i=0;i<20;i++){
        let Fin=[]
        for(j=0;j<Auctions_count;j++){
            Fin.push(Math.random()*2)
        }
        F.push(Fin);

     }

     let e_prev = 0
     if(Weighted.length>0)
     while(1){
 
         Weighted.some((elem) =>{  
            let eij = X[elem[0]][elem[1]] - math.dot(V[elem[0]],arrayColumn(F,elem[1]))
 
             for(k=0;k<20;k++){
                 V[elem[0]][k] =V[elem[0]][k]+F[k][elem[1]]*0.001*2*eij
                 F[k][elem[1]] =F[k][elem[1]]+V[elem[0]][k]*0.001*2*eij
             }
         })
         let sq_error = 0.
     
         Weighted.some((elem) =>{   
             let eij = X[elem[0]][elem[1]] - math.dot(V[elem[0]],arrayColumn(F,elem[1]))
             let meij = eij*eij
     
             sq_error += meij
         })
         let RMSE= math.sqrt(sq_error/Weighted.length)
 
         if (Math.abs(RMSE - e_prev) < 0.00001)
             break
         
         e_prev = RMSE
     }

    let X2 = math.multiply(V,F)
    usr = User_map[userid]

    recomended = []
    for(i=0;i<rec_num;i++){
        var maxval = math.max(X2[usr])
        var max = X2[usr].indexOf(maxval);
        
        if (X2[usr][max] > 0 ){
            if (Auctionslist[max].Active===1 && Auctionslist[max].UserId != userid)
                recomended.push(Auctionslist[max])
            X2[usr][max] = -1.
        }
        else
            break;
    }
    return recomended

})

router.get('/recomended',validT,async (req, res) =>{
    usrid=res.userId.id;
    recomended=await Recom_Auctions(usrid);
    res.json(recomended)
})