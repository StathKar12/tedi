import "./App.css";
import "./Objects/Navigation/NavigationBar.css"
import { BrowserRouter as Router, Route, Routes,Link} from 'react-router-dom';
import Homepage from "./Objects/Homepage/Homepage";
import Auctions from "./Objects/Auctions/Auctions";
import PostAuction from "./Objects/PostAuction/PostAuction";
import SignUp from "./Objects/SignUp/SignUp";
import LogIn from "./Objects/LogIn/LogIn";
import LogOut from "./Objects/LogOut/LogOut";
import Auction  from "./Objects/Auctions/Auction";
import UpdateAuction  from "./Objects/Auctions/UpdateAuction.js";
import UserList from "./Objects/UserList/UserList.js";
import User from "./Objects/UserList/User.js";
import { useEffect, useState  } from "react";
import axios from 'axios';
import Messaging from "./Objects/Messaging/Messaging";
import Description from "./Objects/Messaging/Description";
import Incoming from "./Objects/Messaging/Incoming";
import Outgoing from "./Objects/Messaging/Outgoing";
import Message from "./Objects/Messaging/Message";

function App() {

  const [Active,setActive]=useState();
  useEffect(() => {
    axios.get(`https://localhost:8080/Users/Active/`,{headers: {AccT: sessionStorage.getItem("AccT")}}).then((res)=>{
      if (res.data.error){
        setActive(-1);
      }
      else{
        setActive(res.data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[]);

const renderChoiceActive=()=>{
    if(Active>1){ //User logged in
      return(
        <Router>
          <div className="navigationbar">
            <div className="Links">                                 
              <Link to="/">Home</Link>
              <Link to="/Auctions">Auctions</Link>
              <Link to="/PostAuction">PostAuction</Link>
              <Link to="/Messaging">Messaging</Link>
            </div>
            <div className="navicationbar-right">
              <Link to="/LogOut">LogOut</Link>
            </div>
          </div>
                       
          <Routes>
            <Route path='/' element={<Homepage/>} />
            <Route path='/Auctions' element={<Auctions/>} />
            <Route path='/PostAuction' element={<PostAuction/>} />
            <Route path='/Auction/:Id' element={<Auction/>} />
            <Route path='/Messaging' element={<Messaging/>} />
            <Route path='/Description/:Id' element={<Description/>} />
            <Route path='/Message/:Id' element={<Message/>} />
            <Route path='/Messaging/Incoming' element={<Incoming/>} />
            <Route path='/Messaging/Outgoing' element={<Outgoing/>} />
            <Route path='/LogOut' element={<LogOut/>} />
            <Route path='/UpdateAuction/:Id' element={<UpdateAuction/>} />
          </Routes>
        </Router>
      )
    }else if(Active ===-1)//NOT LOGGED
    {
      return(
        <Router>
          <div className="navigationbar">
          <div className="Links">                                 
            <Link to="/">Home</Link>
            <Link to="/Auctions">Auctions</Link>
          </div>
          <div className="navicationbar-right">
            <Link to="/SignUp">SignUp</Link>
            <Link to="/LogIn">LogIn</Link>
          </div>
        </div>
                       
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/Auctions' element={<Auctions/>} />
          <Route path='/Auction/:Id' element={<Auction/>} />
          <Route path='/LogIn' element={<LogIn/>} />
          <Route path='/SignUp' element={<SignUp/>} />
        </Routes>
      </Router>)
    }else if(Active===1)//ADMIN
    {return(
      <Router>
        <div className="navigationbar">
          <div className="Links">                                 
            <Link to="/">Home</Link>
            <Link to="/Auctions">Auctions</Link>
            <Link to="/PostAuction">PostAuction</Link>
            <Link to="/Messaging">Messaging</Link>
            <Link to="/UserList">UserList</Link>

          </div>
          <div className="navicationbar-right">
            <Link to="/LogOut">LogOut</Link>
          </div>
        </div>
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/Auctions' element={<Auctions/>} />
          <Route path='/PostAuction' element={<PostAuction/>} />
          <Route path='/Auction/:Id' element={<Auction/>} />
          <Route path='/Messaging' element={<Messaging/>} />
          <Route path='/LogOut' element={<LogOut/>} />
          <Route path='/User/:Id' element={<User/>} />
          <Route path='/Description/:Id' element={<Description/>} />
          <Route path='/Message/:Id' element={<Message/>} />
          <Route path='/Messaging/Incoming' element={<Incoming/>} />
          <Route path='/Messaging/Outgoing' element={<Outgoing/>} />
          <Route path='/UserList' element={<UserList/>} />
          <Route path='/UpdateAuction/:Id' element={<UpdateAuction/>} />
          
        </Routes>
      </Router>
      )
    }
  }

  return (
    <div className="App">
      {renderChoiceActive()}
    </div>
  );
}

export default App;