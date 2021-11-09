import "./App.css";
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Components/Layouts/Navbar";
import Landing from "./Components/Layouts/Landing";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Landing} />
      </Switch>
    </Fragment>
  </Router>
);

export default App;
