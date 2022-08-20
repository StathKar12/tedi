import axios from 'axios';
import React from 'react';
import { useEffect, useState  } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import "./Auctions.css"

const getToday=()=>{
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

    today = yyyy+'-'+mm+'-'+dd+"T"+today.getHours()+":"+today.getMinutes();
    return today;
}
function Auction(){

    let {Id} = useParams();
    const [Auction,setAuction]=useState({});
    const [files,setFiles]=useState([]);
    const [location,setLocation]=useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [Bids, setBids] = useState([]);
    let navigate=useNavigate();

    const fun2=(value,key)=>{try {return renderImage(value,key)}catch(err){return <h2 key={key}> </h2>}}
    const renderImage=(file,key)=>{
        
        return(<div key={key} >
            <img className="cropped2" src={require('./../../UploadedItems/'+file.FileName)} alt=""/>  
        </div>)
    }
    const onSubmit=(data)=>{
        if(typeof data.Bid==="undefined")return;
        if(Auction.Number_of_Bids===0 && Number(data.Bid)<Number(Auction.First_Bid)){
            setErrorMessage(`For the First Bid you must place at least: ${Auction.First_Bid} $`);
        }
        else if(Auction.Currently >= data.Bid){
            setErrorMessage(`Please bid more than the current price`);
        }
        else
        {
           if(typeof Auction.Number_of_Bids!=="undefined"){
                const inputBid=
                {
                    Time:getToday(),
                    Amount:data.Bid,
                    AuctionId:Auction.id,
                    Seller:Auction.UserId
                }
                // const inputLocation=
                // {
                //     Country:USERCOUNTRY PERIMENO STATHI
                //     Location:USERLOCATION PERIMENO STATHI
                //     UserId:USERID PERIMENO STATHI
                // }

                axios.post("http://localhost:8080/Bids/",inputBid,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                    if (res.data.error){
                        alert(res.data.error)
                    }else{
                        Auction.Number_of_Bids+=1;
                        Auction.Currently=data.Bid;
                        axios.post(`http://localhost:8080/Auctions/update`,Auction,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                            navigate(0);
                        });
                    }
                });
            }

        } 

    };
    
    const  BuyNow=()=>{
        if(typeof Auction.Active==="undefined")return;
        const inputBid=
        {
            Time:getToday(),
            Amount:Auction.Buy_Price,
            AuctionId:Auction.id,
            Seller:Auction.UserId
        }
        // const inputLocation=
        // {
        //     Country:USERCOUNTRY PERIMENO STATHI
        //     Location:USERLOCATION PERIMENO STATHI
        //     UserId:USERID PERIMENO STATHI
        // }
        axios.post("http://localhost:8080/Bids/",inputBid,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                Auction.Number_of_Bids+=1;
                Auction.Active=2;
                Auction.Currently=Auction.Buy_Price;
                axios.post(`http://localhost:8080/Auctions/update`,Auction,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) =>{
                    navigate(0);
                });
            }
        });
    };
    const renderBuyPrice = () => {
        if(Auction.Buy_Price!=null)
            return <div> <button className='bidbutton' type="button" onClick={BuyNow}>Click To Buy Now For {Auction.Buy_Price}$!</button></div>;
            else
            return <h2> </h2>
    }
    const initialValues={
        Bid:""
    };
    
    
    const renderIfNotExpired=()=>{

        if(typeof Auction.Active!="undefined")
        {
           if(Auction.Active===0){
            return <h1 className="SOLD">This Auction Has Not Yet Started You Can Bid Soon!</h1>
           }else if(Auction.Active===2){
                return <h1 className="SOLD"> SOLD FOR :{Auction.Currently}</h1>
            }else if(Auction.Active===-1){
            return <h1 className="exp" >This Auction Has Expired You Can No Longer Bid!</h1>
           }
           return <div className="PostBid">
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form >
                            <ErrorMessage id="PostAuctionForm"  name="Bid" component="h1"/>
                            {errorMessage && <div > <h1>{errorMessage} </h1></div>}
                            <Field id="PostAuctionForm" name="Bid" placeholder="(Ex.200)"/>
                            <div><button className='bidbutton' type="submit">Current Bid is {Auction.Currently} $ , Click to Bid</button></div>
                        </Form>
                    </Formik>
                    {renderBuyPrice()}
                </div> 
        }
        return <h1> </h1>
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/Auctions/byid/${Id}`).then((res)=>{
            
            res.data.Started=res.data.Started.replace("T", " At: ");
            res.data.Ends=res.data.Ends.replace("T", " At: ");
           
            setAuction(res.data);
        });
        axios.get(`http://localhost:8080/Upload/byid/${Id}`).then((res2)=>{
            setFiles(res2.data);    
        });
        axios.get(`http://localhost:8080/Location/${Id}`).then((res3)=>{
            setLocation(res3.data[0]);
        });
        axios.get(`http://localhost:8080/Bids/byid/${Id}`).then((res4)=>{
            setBids(res4.data);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    const validationSchema = Yup.object().shape({
        Bid: Yup.number().required(),
    });
    
    return(
    <div className='grid'>
    <div className='TryLeft'>
        <div className='CompleteAuction'>
            <div className="AuctionTitle"><span>{Auction.Name}</span></div>
            <div className='Photos'>
                {files.map((file,key)=>{
                    return (
                        fun2(file,key)
                    );
                })}
            </div>
            <div className='body2'>
                <h3 id="bd">Number of bids :{Auction.Number_of_Bids}</h3>
                <h3 id="bd">Country : {location.Country} </h3>
                <h3 id="bd">Location : {location.Location} , Cords : ({location.Longtitude},{location.atitude})</h3>
                <h3 id="bd">Seller: {Auction.Seller} </h3>
                <h3 id="bd">Seller Rating: {Auction.SellerRating} </h3>
                <h3 id="bd">Starts : {Auction.Started}</h3>       
                <h3 id="bd">Ends :{Auction.Ends}</h3>
                <h3 id="bd">Description:</h3>       
                <h3 id="bd" className='desc'>{Auction.Description}</h3>
            </div>
        </div> 
        </div>
        <div className='Auction'>

            {renderIfNotExpired()}

            {Bids.map((value,key) => {
                return ( 
                <div className="body2" key={key}>
                    <h3>Bidder: {value.Bidder}</h3>
                    <h3>Country: PERIMENO STATHI</h3>
                    <h3>Location: PERIMENO STATHI</h3>
                    <h3>Rating: {value.BidderRating}</h3>
                    <h3>Amount: {value.Amount}</h3>
                    <h3>Time: {value.Time}</h3>
                </div>
                )
            })}
        </div>
    </div>
    );
}

export default Auction