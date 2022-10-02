import React from 'react';
import axios from 'axios';
import {Route,Routes,Link} from 'react-router-dom';
import Incoming from "../Messaging/Incoming";
import Outgoing from "../Messaging/Outgoing";
import "./Messaging.css"
import { useNavigate} from "react-router-dom";
import { useEffect, useState  } from "react";


function Messaging() {
  

  const [ComAuc, setComAuc] = useState([]);
  let navigate=useNavigate();
  const [,setActive]=useState();

  useEffect(() => {
            
    axios.get(`https://localhost:8080/Users/Active/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
        if (res.data.error){
           setActive(-1);
         }
         else{
           setActive(res.data);
           axios.get(`https://localhost:8080/Auctions/CmpAuc/${res.data}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
            if (res.data.error){
                alert(res.data.error)
            }else{
                setComAuc(res.data);
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
          <Link to="/Messaging/Outgoing">Outgoing</Link>
        </div>
        <Routes>
          <Route path='/Messaging/Incoming' element={<Incoming/>} />
          <Route path='/Messaging/Outgoing' element={<Outgoing/>} />
        </Routes>
      </div>
      <div className='User'>
          <table>
              <caption className='Title'>Complete Auctions</caption>
              <thead>
                  <tr>
                      <th scope="col">Id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Seller Username</th>
                      <th scope="col">Buyer ID</th>
                      <th scope="col">Value</th>
                  </tr>
              </thead>
              <tbody>
              {ComAuc.map((value,key) =>
                  {
                      return (             
                              <tr className='body5' key={key} onClick={()=>{navigate(`/Description/${value.id}`)}}>
                                  <th scope="row">{value.id}</th>
                                  <td>{value.Name}</td>
                                  <td>{value.UserId}</td>
                                  <td>{value.Buyer_Id}</td>
                                  <td>{value.Currently}</td>
                              </tr>          
                          )
                  })}
              </tbody>
          </table>
      </div>
    </div>
  );
    
    
}

export default Messaging
