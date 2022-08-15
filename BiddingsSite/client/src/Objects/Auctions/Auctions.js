import React from "react"
import axios from "axios";
import "./Auctions.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Auctions() {

  const renderBuyPrice = (Buy_Price) => {
    if(Buy_Price!=null)
        return <h2>Buy Now For : {Buy_Price}</h2>;
    else
        return <h2> </h2>
  }

  let [image, setImage] = useState();
  


  const renderImage=(value)=>{
    if(typeof value.FileName !=="undefined"){
        return <img className="cropped2" src={require('./../../UploadedItems/'+value.FileName)} alt=""/>;
    }
    return <h1>  </h1>
  }

    let navigate=useNavigate();
    const [listOfAuctions, setlistOfAuctions] = useState([]);

    useEffect(() => {
      axios.get("http://localhost:8080/Auctions/all").then((res) => {
        setlistOfAuctions(res.data);
        });
    },[]);

    return (
      <div>
       {listOfAuctions.map((value,key) => {
            return ( 
               <div className="Auction" key={key} onClick={()=>{navigate(`/Auction/${value.id}`)}}> 
                <div className="title"> <span>{value.Name}</span> </div>
                <div className="body" >  
                  {renderBuyPrice(value.Buy_Price)} 
                  {renderImage(value)}
                  <h2>Current Bid :{value.Currently} </h2>
                </div>
                <div className="footer">
                  <h2 id="left">Starts : {value.Started.replace("T", " At: ")}</h2>       
                  <h2 id="right">Ends :{value.Ends.replace("T", " At: ")}</h2>
                </div> 
              </div>
            ); 
        })}
        
      </div>
    )
}

export default Auctions;
