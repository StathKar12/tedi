import axios from 'axios';
import React from 'react';
import { useEffect, useState  } from "react";
import { useNavigate,useParams } from "react-router-dom";

import "./Auctions.css"


function Auction(){

    let {Id} = useParams();
    const [Auction,setAuction]=useState({});
    const [files,setFiles]=useState([]);
    const [location,setLocation]=useState([]);

    const renderBuyPrice = (Buy_Price) => {
        if(Buy_Price!=null)
            return <h2>Buy Now For : {Buy_Price}</h2>;
        else
            return <h2> </h2>
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/Auctions/byid/${Id}`).then((res)=>{
            
            res.data.Started=res.data.Ends.replace("T", " At: ");
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

    return(
        <div className='CompleteAuction'>
            <div className="AuctionTitle"><span>{Auction.Name}</span></div>
            <div className='Photos'>
                {files.map((file,key)=>{
                    return (
                    <div key={key} className="File">
                      <img className="cropped2" src={require('./../../UploadedItems/'+file.FileName)} alt=""/>  
                    </div>
                    );
                })}
            </div>
            <div className="CompleteBody" >
                {renderBuyPrice(Auction.Buy_Price)}   
                <h2>Current price :{Auction.Currently} </h2>
                <h3>Number of bids :{Auction.Number_of_Bids}</h3>
                <h3>Country : {location.Country} </h3>
                <h3>Location : {location.Location} , Cords : ({location.Longtitude},{location.atitude})</h3>
                <h3>Seller: PERIMENO TON STATHI </h3>
            </div>
            <div className="footer">
                <h2 id="left">Starts : {Auction.Started}</h2>       
                <h2 id="right">Ends :{Auction.Ends}</h2>
            </div>
            <div className="Description">
                <h3>Description:</h3>       
                <h4>{Auction.Description}</h4>
            </div> 
        </div>
    );
}

export default Auction
