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
            return (
              <div className="Auction" key={key}>
                <div className="title"> {value.Title} </div>
                <div className="body" > {value.Text} </div>
                <div className="footer">User : {value.Username} </div>
              </div>
            );
        })}
      </div>
    )
}

export default Auctions;
