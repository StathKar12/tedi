import React from 'react';
import "./UserList.css"
import { useNavigate,useParams} from "react-router-dom";
import { useEffect, useState  } from "react";
import axios from 'axios';

function User() {

  let {Id} = useParams();
  const [User, setUser] = useState([]);
  let navigate=useNavigate();
  const onClick=()=>{
    User.Active=1;
    axios.post(`https://localhost:8080/Users/AdminApprove/${Id}`,User,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
      if (res.data.error){
          alert(res.data.error)
      }else{
          console.log("Approved");
          navigate(0);
      }
   });

  };
  const onClick2=()=>{
    axios.post(`https://localhost:8080/Users/AdminDelete/${Id}`,User,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
      if (res.data.error){
          alert(res.data.error)
      }else{
          navigate("/UserList");
          navigate(0);
      }
    });
  };

  useEffect(() => {
    axios.get(`https://localhost:8080/Users/AdminGet/${Id}`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
        if (res.data.error){
            alert(res.data.error)
        }else{
          if(res.data.Active)
            res.data.uState="Approved";
            else{
              res.data.uState="Pending"
            }
            setUser(res.data);
        }
     });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const renderApprove=(()=>{
    if(!User.Active)
      return <button className='bidbutton' type="submit" onClick={onClick}>Click To Approve</button>;
    return <h1> </h1>
  })
  return (
    <div className='User'>
        <table>
            <caption className='Title'>User Info</caption>
            <thead href="style.css" rel="stylesheet">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Username</th>
                    <th scope="col">Name</th>
                    <th scope="col">LastName</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody> 
             <tr className='body6'>
                <th scope="row">{User.id}</th>
                <td>{User.username}</td>
                <td>{User.Name}</td>
                <td>{User.LastName}</td>
                 <td>{User.Email}</td>
                 </tr>          
            </tbody>
        </table>
        <table>
            <thead href="style.css" rel="stylesheet">
                <tr>
                    <th scope="col">Phone</th>
                    <th scope="col">AFM</th>
                    <th scope="col">Location</th>
                    <th scope="col">Country</th>
                    <th scope="col">Approval</th>
                </tr>
            </thead>
            <tbody> 
             <tr className='body6'>
                <th scope="row">{User.Phone}</th>
                <td>{User.AFM}</td>
                <td>{User.Location}</td>
                <td>{User.Country}</td>
                 <td>{User.uState}</td>
                 </tr>          
            </tbody>
        </table>
        {renderApprove()}
        <button className='bidbutton' type="submit" onClick={onClick2}>Click To Delete</button>
    </div>
  );
}

export default User;
