import React from 'react';
import "./UserList.css"
import { useNavigate} from "react-router-dom";
import { useEffect, useState  } from "react";
import axios from 'axios';

function UserList() {

  let navigate=useNavigate();
  const [listofUsers, setlistofUsers] = useState([]);

  useEffect(() => {
    axios.get(`https://localhost:8080/Users/AdminGet/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
        if (res.data.error){
            alert(res.data.error)
        }else{
            setlistofUsers(res.data);
        }
     });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <div className='LogOut'>
        <table>
            <caption className='Title'>Users List</caption>
            <thead href="style.css" rel="stylesheet">
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Username</th>
                    <th scope="col">Name</th>
                    <th scope="col">LastName</th>
                    <th scope="col">Approval</th>
                </tr>
            </thead>
            <tbody>    
                {listofUsers.map((value,key) =>
                {
                    let state="";
                    if(!value.Active){
                    state="Pending"
                    }else {
                        state="Approved"
                    }
                    return (             
                            <tr className='body5' key={key} onClick={()=>{navigate(`/User/${value.id}`)}}>
                                <th scope="row">{value.id}</th>
                                <td>{value.username}</td>
                                <td>{value.Name}</td>
                                <td>{value.LastName}</td>
                                <td>{state}</td>
                            </tr>          
                        )
                })}
            </tbody>
        </table>
    </div>
  );
}

export default UserList;
