import React from 'react';
import axios from 'axios';
import {Route,Routes,Link} from 'react-router-dom';
import Incoming from "../Messaging/Incoming";
import "./Messaging.css"
import { useNavigate} from "react-router-dom";
import { useEffect, useState  } from "react";


function Outgoing() {
  

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
           axios.get(`https://localhost:8080/Messaging/SendMessage/${res.data}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
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
          <Link to="/Messaging/Incoming">Incoming</Link>
        </div>
        <Routes>
          <Route path='/Messaging/Incoming' element={<Incoming/>} />
        </Routes>
      </div>
      <div className='User'>
          <table>
              <caption className='Title'>Outgoing Messages</caption>
              <thead>
                  <tr>
                      <th scope="col">For Auction</th>
                      <th scope="col">From User</th>
                      <th scope="col">To User</th>
                      <th scope="col">Date</th>
                  </tr>
              </thead>
              <tbody>
              {Receive.map((value,key) =>
                  {
                      return (             
                              <tr className='body5' key={key} onClick={()=>{navigate(`/Message/${value.id}`)}}>
                                  <th scope="row">{value.AuctionId}</th>
                                  <td>{value.UserId}</td>
                                  <td>{value.Send_To}</td>
                                  <td>{value.Time_Send}</td>
                              </tr>          
                          )
                  })}
              </tbody>
          </table>
      </div>
    </div>
  );
    
    
}

export default Outgoing