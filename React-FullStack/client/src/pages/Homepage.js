import React from "react"
import axios from "axios";
import { useEffect, useState } from "react";

function Homepage() {

    const [listOfAyctions, setlistOfAuctions] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/Auctions").then((res) => {
        setlistOfAuctions(res.data);
        });
    }, []);

    return (
      <div>
         {listOfAyctions.map((value,key) => {
            return (
              <div className="Auction">
                <div className="title"> {value.title} </div>
                <div className="body"> {value.Text} </div>
                <div className="footer"> {value.username} </div>
              </div>
            );
        })}
      </div>
    )
}

export default Homepage;
