import React from "react";
import axios from "axios";
import "./Auctions.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {Formik,Form,Field,ErrorMessage} from "formik";

const options =
 [  { label: "Tech ", value: "Tech" },
    { label: "Electronics ", value: "Electronics" },
    { label: "Fashion ", value: "Fashion" },
    { label: "Health & Beauty ", value: "Health & Beauty" },
    { label: "Home & Gsarden ", value: "Home & Garden " },
    { label: "Art ", value: "Art" },
    { label: "Motors ", value: "Motors" },
    { label: "Industrial equipment ", value: "Industrial equipment" },
  ];


function Auctions() {
  
  const [selected, setSelected] = useState([]);
  const [renderbycat,setcat]=useState([])
  
  const fun2=(value)=>{try {return renderImage(value)}catch(err){return <h2> </h2>}}

  const renderBuyPrice = (Buy_Price) => {
    if(Buy_Price!=null)
        return <h2>Buy Now For : {Buy_Price}</h2>;
    else
        return <h2> </h2>
  }
  const renderImage=(value)=>{
    if(typeof value.FileName !=="undefined"){
        return <img className="cropped2" src={require('./../../UploadedItems/'+value.FileName)} alt=""/>;
    }
    return <h1>  </h1>
  }
  const renderIfNotExpired=(Auction)=>{

    if(typeof Auction.Active!=undefined)
    {
       if(Auction.Active===0){
        return <h1>This Auction Has Not Yet Started You Can Bid Soon!</h1>
       }else if(Auction.Active===-1){
        return <h1>This Auction Has Expired You Can No Longer Bid!</h1>
       }else if(Auction.Active===2){
        return <h1>SOLD FOR : {Auction.Currently}</h1>
       }
       return <h3>Open For Bids</h3>
    }
    return <h1> </h1>
  };

    let navigate=useNavigate();
    const [listOfAuctions, setlistOfAuctions] = useState([]);
    const [sendRequest ,setsendRequest] =useState();

    useEffect(() => {
      axios.get("http://localhost:8080/Auctions/all",{
        params: {selected}
      }).then((res) => {
        setlistOfAuctions(res.data);
        });
    },[sendRequest]);
    
    return (
      <div>
        <div className="Select"> 
          <Select name={"Categories"} options={options} selected={selected} onChange={setSelected} isMulti={true} placeholder={"Categorical Search "}/>
          <button  id="button" type="button" onClick={setsendRequest}>Click To Search!</button> 
        </div>
       {listOfAuctions.map((value,key) => {
            return ( 
               <div className="Auction" key={key} onClick={()=>{navigate(`/Auction/${value.id}`)}}> 
                <div className="title"> <span>{value.Name}</span> </div>
                <div className="body" >  
                  {renderBuyPrice(value.Buy_Price)} 
                  {fun2(value)}
                  <h2>Current Bid :{value.Currently} </h2>
                  {renderIfNotExpired(value)}
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
