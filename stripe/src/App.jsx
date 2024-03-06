import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PayNowButton from "./components/PayNowButton";
import Success from "./pages/Success";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={PayNowButton} />
        <Route path="/success" exact component={Success} />
      </Switch>
    </Router>
  );
}

export default App;
