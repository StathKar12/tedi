import "./App.css";
import "./Objects/Navigation/NavigationBar.css"
import { BrowserRouter as Router, Route, Routes,Link} from 'react-router-dom';
import Homepage from "./Objects/Homepage/Homepage";
import Auctions from "./Objects/Auctions/Auctions";
import PostAuction from "./Objects/PostAuction/PostAuction";
import SignUp from "./Objects/SignUp/SignUp";
import LogIn from "./Objects/LogIn/LogIn";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="navigationbar">
          <div className="Links">                                 
            <Link to="/">Home</Link>
            <Link to="/Auctions">Auctions</Link>
            <Link to="/PostAuction">PostAuction</Link>
          </div>
          <div className="navicationbar-right">
            <Link to="/SignUp">SignUp</Link>
            <Link to="/LogIn">LogIn</Link>
          </div>
        </div>
                       
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/Auctions' element={<Auctions/>} />
          <Route path='/PostAuction' element={<PostAuction/>} />
          <Route path='/LogIn' element={<LogIn/>} />
          <Route path='/SignUp' element={<SignUp/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;