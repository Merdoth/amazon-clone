import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Orders from './components/Orders/Orders';
import Header from './components/Header/Header';
import Payment from './components/Payment/Payment';
import Checkout from './components/Checkout/Checkout';
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

const promise = loadStripe("pk_test_51JB9kLDewWTodU3W7PhcXmf577wmQ1pids4CMi9gjkfJV1zef3d1ttIW0NxzOBZTWMOQXPYUVdLVUWII3u3LQGf500VQvecPGj")

function App() {

  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, []);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
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
