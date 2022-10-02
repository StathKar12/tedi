import React from "react";
import axios from "axios";
import "./Auctions.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
  const [listOfRecomended, setRecom] = useState([]);

  const fun2=(value)=>{try {return renderImage(value)}catch(err){return <h2> </h2>}}

  const renderBuyPrice = (Buy_Price) => {
    if(Buy_Price!=null)
        return <h2>Buy Now For : {Buy_Price}</h2>;
    else
        return <h2> </h2>
  }
  const renderImage=(value)=>{
    if(typeof value.FileName !=="undefined"){
        return <img className="cropped1" src={require('./../../UploadedItems/'+value.FileName)} alt=""/>;
    }
    return <h1>  </h1>
  }
  const renderIfNotExpired=(Auction)=>{

    if(typeof Auction.Active!="undefined")
    {
       if(Auction.Active===0){
        return <h2 className="SOLD">This Auction Has Not Yet Started You Can Bid Soon!</h2>
       }else if(Auction.Active===-1){
        return <h2 className="exp" >This Auction Has Expired You Can No Longer Bid!</h2>
       }else if(Auction.Active===2){
        return <div className="SOLD" > SOLD FOR : {Auction.Currently}</div>
       }
       return <h3>Open For Bids</h3>
    }
    return <h1> </h1>
  };

    let navigate=useNavigate();
    const [listOfAuctions, setlistOfAuctions] = useState([]);
    const [sendRequest ,setsendRequest] =useState();


    useEffect(() => {
      const More = document.getElementById('left').value
      const Less = document.getElementById('right').value
      let Desc=""
      if(document.getElementById('Desc')!==null)
        Desc = document.getElementById('Desc').value;

      let Loc = ""
      if(document.getElementById('Loc')!==null)
        Loc=document.getElementById('Loc').value
      axios.get("https://localhost:8080/Auctions/all",{
        params: {selected,More,Less,Desc,Loc}
      }).then((res) => {
        setlistOfAuctions(res.data);
        });
        axios.get("https://localhost:8080/Auctions/recomended", {headers: {AccT: sessionStorage.getItem("AccT")}}).then((res) => {
          if(!res.data.error)  
            setRecom(res.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[sendRequest]);

    return (
      <div>
        <div> 
            <div className="PriceRange">
            <div className="Select"> 
              <Select name={"Categories"} options={options} selected={selected} onChange={setSelected} isMulti={true} placeholder={"Categorical Search "} />
            </div>
            <div id="Range">
              <input type="number" id="left" name="More" placeholder="More Than" />
              <input type="number"  id='right' name="Less"  placeholder="Less Than" />
            </div>
              <input type="text" className='Select' id="Desc"  placeholder="Search by Description" />
              <input type="text" className='Select' id="Loc"  placeholder="Search by Location" />
            <button  id="button" type="submit" onClick={setsendRequest}>Click To Search!</button> 
            </div>
        </div>
        {listOfRecomended.map((value,key) => {
            return ( 
               <div className="Auction" key={key} onClick={()=>{navigate(`/Auction/${value.id}`)}}> 
                <div className="title"> <span>{value.Name}</span> </div>
                <div className="body" >  
                  <h1> RECOMENDED </h1>
                  {renderBuyPrice(value.Buy_Price)} 
                  {fun2(value)}
                  <h2>Current Bid :{value.Currently} </h2>
                  <h2>Seller :{value.UserId}</h2>
                  <h2>Description :{value.Description}</h2>
                  {renderIfNotExpired(value)}
                </div>
                <div className="footer">
                  <h2 id="left">Seller : {value.Seller}</h2>       
                  <h2 id="right">Seller Rating :{value.SellerRating}</h2>
                </div> 
                <div className="footer">
                  <h2 id="left">Starts : {value.Started.replace("T", " At: ")}</h2>       
                  <h2 id="right">Ends :{value.Ends.replace("T", " At: ")}</h2>
                </div> 
              </div>
            ); 
        })}
       {listOfAuctions.map((value,key) => {
            return ( 
               <div className="Auction" key={key} onClick={()=>{navigate(`/Auction/${value.id}`)}}> 
                <div className="title"> <span>{value.Name}</span> </div>
                <div className="body" >  
                  {renderBuyPrice(value.Buy_Price)} 
                  {fun2(value)}
                  <h2>Current Bid :{value.Currently} </h2>
                  <h2>Seller :{value.UserId}</h2>
                  <h2>Description :{value.Description}</h2>
                  {renderIfNotExpired(value)}
                </div>
                <div className="footer">
                  <h2 id="left">Seller : {value.Seller}</h2>       
                  <h2 id="right">Seller Rating :{value.SellerRating}</h2>
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
