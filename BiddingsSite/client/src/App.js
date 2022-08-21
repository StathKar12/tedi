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
import UserList from "./Objects/UserList/UserList.js";
import User from "./Objects/UserList/User.js";
import { useEffect, useState  } from "react";
import axios from 'axios';

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
            <Route path='/LogOut' element={<LogOut/>} />
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
          <Route path='/LogOut' element={<LogOut/>} />
          <Route path='/User/:Id' element={<User/>} />
          <Route path='/UserList' element={<UserList/>} />
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