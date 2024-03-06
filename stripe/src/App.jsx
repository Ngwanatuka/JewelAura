import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import PayNowButton from "./components/PayNowButton";
import Success from "../pages/Success";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" exact component={PayNowButton} /> */}
        <Route path="/success" exact component={Success} />
      </Routes>
    </Router>
  );
}

export default App;
