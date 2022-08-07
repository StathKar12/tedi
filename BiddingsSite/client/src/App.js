import "./App.css";
import "./Objects/Navigation/NavigationBar.css"
import { BrowserRouter as Router, Route, Routes,Link} from 'react-router-dom';
import Homepage from "./Objects/Homepage/Homepage";
import PostAuction from "./Objects/PostAuction/PostAuction";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="navigationbar">
          <div className="Links">                                 
            <Link to="/">Home</Link>
            <Link to="/PostAuction">PostAuction</Link>
          </div>
          <div className="navicationbar-right">
            <Link to="/SignUp">SignUp</Link>
            <Link to="/LogIn">LogIn</Link>
          </div>
        </div>
                       
        <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/PostAuction' element={<PostAuction/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;