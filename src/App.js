import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import Checkout from './components/Checkout/Checkout';

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
    </div>
    </Router>
  );
}

export default App;
