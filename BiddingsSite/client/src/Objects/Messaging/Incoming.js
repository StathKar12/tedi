import React from 'react';
import axios from 'axios';
import {Route,Routes,Link} from 'react-router-dom';
import Outgoing from "../Messaging/Outgoing";
import "./Messaging.css"
import { useNavigate} from "react-router-dom";
import { useEffect, useState  } from "react";


function Incoming() {
  

  const [Receive, setReceive] = useState([]);
  let navigate=useNavigate();
  const [,setActive]=useState();

  useEffect(() => {
            
    axios.get(`https://localhost:8080/Users/Active/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
        if (res.data.error){
           setActive(-1);
         }
         else{
           setActive(res.data);
           axios.get(`https://localhost:8080/Messaging/ReceiveMessage/${res.data}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                setReceive(res.data);
            }
         });
        }
   });
   // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div>
      <div className='MessagingSidebar'>
        <div className='a'>
          <Link to="/Messaging/Outgoing">Outgoing</Link>
        </div>
        <Routes>
          <Route path='/Messaging/Outgoing' element={<Outgoing/>} />
        </Routes>
      </div>
      <div className='User'>
          <table>
              <caption className='Title'>Incoming Messages</caption>
              <thead>
                  <tr>
                      <th scope="col">For Auction</th>
                      <th scope="col">From User</th>
                      <th scope="col">To User</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                  </tr>
              </thead>
              <tbody>
              {Receive.map((value,key) =>
                  {
                    let state="";
                    if(value.Status){
                      state="Read"
                    }else {
                        state="UnRead"
                    }
                      return (             
                              <tr className='body5' key={key} onClick={()=>{navigate(`/Message/${value.id}`)}}>
                                  <th scope="row">{value.AuctionId}</th>
                                  <td>{value.UserId}</td>
                                  <td>{value.Send_To}</td>
                                  <td>{value.Time_Send}</td>
                                  <td>{state}</td>
                              </tr>          
                          )
                  })}
              </tbody>
          </table>
      </div>
    </div>
  );
    
    
}

export default Incoming
