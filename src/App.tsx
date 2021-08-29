import React from "react";
import "./App.scss";
import { HomePage } from "./screens/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import { GamePage } from "./screens/Game";
import { AddLocations } from "./screens/AddLocations";



const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/play">
          <GamePage />
        </Route>
        <Route path="/add-location-220">
          <AddLocations />
        </Route>
        <Route path="/">
          <HomePage></HomePage>
        </Route>
      </Switch>
    </Router>
  );
};

function App() {
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
