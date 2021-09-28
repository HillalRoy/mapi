import React from "react";
import "./App.scss";
import { HomePage } from "./screens/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import { GamePage } from "./screens/Game";



const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/play">
          <GamePage />
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
