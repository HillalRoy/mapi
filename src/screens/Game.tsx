import React from "react";
import { useHistory } from "react-router-dom";
import { GameOptions } from "../components/GameOptions";
import { StreetView } from "../components/StreetViewer";
import { APP_NAME } from "../Constants";
import { loadGMaps } from "../gapi/loadGMap";
import { useAppSelector } from "../hooks/redux";
import { getScore } from "../store/GameReducers";
import { getUsername } from "../store/UserReducers";
import "./game.scss";

export const GamePage = () => {
  const username = useAppSelector(getUsername);
  const history = useHistory();

  if (username === "") history.replace("/");
  const score = useAppSelector(getScore);

  return (
    <section id="game-page" className="screen">
      <div id="game-view">
        <StreetView />
      </div>
      <div className="overlay">
        <div className="top z1">
          <div className="stats">
            {username}
            <div className="score">
              Score: {score}
            </div>
            <button>Restart</button>
            <button>Giveup</button>
          </div>
          <div className="title z1"> {APP_NAME} </div>
          <div className="logo z1"></div>
        </div>
        <div className="game-controls">
          <GameOptions/>
        </div>
      </div>
    </section>
  );
};
