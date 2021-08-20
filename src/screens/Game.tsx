import React from "react";
import { useHistory } from "react-router-dom";
import { StreetView } from "../components/StreetViewer";
import { APP_NAME } from "../Constants";
import { useAppSelector } from "../hooks/redux";
import { getUsername } from "../store/reducers";
import "./game.scss";

export const GamePage = () => {
  const username = useAppSelector(getUsername);
  const history = useHistory()
  
  if(username === "") history.replace("/")

  return (
    <section id="game-page" className="screen">
      <div id="game-view">
        <StreetView/>
      </div>
      <div className="top">
        <div className="stats">
          {username}
          <button>Restart</button>
          <button>Giveup</button>
        </div>
        <div className="title"> {APP_NAME} </div>
        <div className="logo"></div>
      </div>
      <div className="game-controls">
        <div className="options">
          <button>buut</button>
          <button>buut</button>
          <button>buut</button>
          <button>buut</button>
        </div>
      </div>
    </section>
  );
};
