import "./App.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Homepage/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;