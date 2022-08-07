import React from "react"
import axios from "axios";
import "./Homepage.css"
import { useEffect, useState } from "react";

function Homepage() {

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
              <div className="Auction">
                <div className="title"> {value.Title} </div>
                <div className="body"> {value.Text} </div>
                <div className="footer">User : {value.Username} </div>
              </div>
            );
        })}
      </div>
    )
}

export default Homepage;
