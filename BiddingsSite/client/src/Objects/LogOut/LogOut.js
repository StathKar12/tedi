import React from 'react';
import "./LogOut.css"
import { useNavigate} from "react-router-dom";



function LogOut() {

  let navigate=useNavigate();


  const LogOut = () => {
    console.log("TEST\n");
    sessionStorage.removeItem("AccT");
    navigate("/");
    navigate(0);
  };

  return (
    <div className="LogOut">
      <button onClick={LogOut}> LogOut </button>
    </div>
  );
}

export default LogOut;
