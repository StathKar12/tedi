import axios from 'axios';
import React from 'react';
import { useEffect, useState  } from "react";
import { useNavigate,useParams } from "react-router-dom";
import {Formik,Form,Field,ErrorMessage} from "formik";
import * as Yup from 'yup';
import "./Auctions.css"


function Auction(){

    let {Id} = useParams();
    const [Auction,setAuction]=useState({});
    const [files,setFiles]=useState([]);
    const [location,setLocation]=useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    let navigate=useNavigate();

    const fun2=(value,key)=>{try {return renderImage(value,key)}catch(err){return <h2 key={key}> </h2>}}
    const renderImage=(file,key)=>{
        
        return(<div key={key} >
            <img className="cropped2" src={require('./../../UploadedItems/'+file.FileName)} alt=""/>  
        </div>)
    }
    const onSubmit=(data)=>{
        if(Auction.Number_of_Bids===0 && Number(data.Bid)<Number(Auction.First_Bid)){
            setErrorMessage(`For the First Bid you must place at least: ${Auction.First_Bid} $`);
        }
        else
        {
            console.log("YOU PLACED YOUR BID");
            navigate(0);
        } 

    };
    
    const  BuyNow=()=>{
        if(typeof Auction.Active==="undefined")return;
        console.log("You Bought Now");
        Auction.Number_of_Bids+=1;
        Auction.Active=2;
        Auction.Currently=Auction.Buy_Price;
        axios.post(`http://localhost:8080/Auctions/update`,Auction).then((res) =>{
            navigate(0);
        });
    };
    const renderBuyPrice = () => {
        if(Auction.Buy_Price!=null)
            return <div> <h2><label id="PostAuctionForm">Buy Now For {Auction.Buy_Price}: </label></h2>
                    <button type="button" onClick={BuyNow}>Click To Buy Now!</button></div>;
            else
            return <h2> </h2>
    }
    const initialValues={
        Bid:""
    };

    const renderIfNotExpired=()=>{

        if(typeof Auction.Active!=undefined)
        {
           if(Auction.Active===0){
            return <h1>This Auction Has Not Yet Started You Can Bid Soon!</h1>
           }else if(Auction.Active===2){
                return <h1> SOLD FOR :{Auction.Currently}</h1>
            }else if(Auction.Active===-1){
            return <h1>This Auction Has Expired You Can No Longer Bid!</h1>
           }
           return <div className="PostBid">
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
                        <Form >
                            <h2 id="PostAuctionForm1">Currently :{Auction.Currently}</h2>
                            <h2><label id="PostAuctionForm2"> Bid Now : </label></h2>
                            <ErrorMessage id="PostAuctionForm"  name="Bid" component="h1"/>
                            {errorMessage && <div > <h1>{errorMessage} </h1></div>}
                            <Field id="PostAuctionForm" name="Bid" placeholder="(Ex.200)"/>
                            <div><button type="submit">Bid</button></div>
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


    const validationSchema = Yup.object().shape({
        Bid: Yup.number().required(),
    });
    
    return(
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
            <div>
                <h3>Number of bids :{Auction.Number_of_Bids}</h3>
                <h3>Country : {location.Country} </h3>
                <h3>Location : {location.Location} , Cords : ({location.Longtitude},{location.atitude})</h3>
                <h3>Seller: PERIMENO TON STATHI </h3>
                <h3 >Starts : {Auction.Started}</h3>       
                <h3 >Ends :{Auction.Ends}</h3>
                <h3>Description:</h3>       
                <h3 className='desc'>{Auction.Description}</h3>
            </div>
        </div> 
        {renderIfNotExpired()}
    </div>
    );
}

export default Auction
