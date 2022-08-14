import React from "react"
import axios from "axios";
import "./Auctions.css"
import { useEffect, useState } from "react";

function Auctions() {

    const [listOfAuctions, setlistOfAuctions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/Auctions").then((res) => {
        setlistOfAuctions(res.data);
        });
    }, []);

    return (
      <div>
         {listOfAuctions.map((value,key) => {
            if(value.Buy_Price!=null){
            return (
              <div className="Auction" key={key}>
                <div className="title"> <span>{value.Name}</span> </div>
                <div className="body" > 
                  <h2>Buy Now for : {value.Buy_Price} </h2>
                  <h2>Current price :{value.Currently} </h2>
                </div>
                <div className="footer">
                  <h2 id="left">Starts : {value.Started.replace("T", " At: ")}</h2>       
                  <h2 id="right">Ends :{value.Ends.replace("T", " At: ")}</h2>
                </div>
              </div>
            );
          }
          else
          {
            return (
              <div className="Auction" key={key}>
                <div className="title"> <span>{value.Name}</span> </div>
                <div className="body" > 
                  <h2>Current price :{value.Currently} </h2>
                </div>
                <div className="footer">
                  <h2 id="left">Starts : {value.Started.replace("T", " At: ")}</h2>       
                  <h2 id="right">Ends :{value.Ends.replace("T", " At: ")}</h2>  
                </div>
              </div>
            );
          }
        })}
        
      </div>
    )
}

export default Auctions;
