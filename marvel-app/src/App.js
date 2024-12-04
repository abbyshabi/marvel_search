import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
// import Compare from "./compare";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/compare" element={<Compare />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
