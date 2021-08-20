import React from "react";
import { useHistory } from "react-router-dom";
import { GameOptions } from "../components/GameOptions";
import { StreetView } from "../components/StreetViewer";
import { APP_NAME } from "../Constants";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getScore, giveupGame, restartGame } from "../store/GameReducers";
import { getUsername } from "../store/UserReducers";
import "./game.scss";

const buttonBg = { backgroundImage: "url('/assets/buttonbg.png')" };
const statusBg = { backgroundImage: "url('/assets/statusbg.png')" };

const ScoreBoard: React.FC<{ username: string; score: number }> = ({
  username,
  score,
}) => {
  const dispatch = useAppDispatch()


  return (
    <>
      <div className="stats">
        <div style={statusBg} className="usrname ibg">
          {username}
        </div>

        <div style={statusBg} className="score ibg">
          Score: {score}
        </div>

        <button onClick={() => dispatch(restartGame(null))} style={buttonBg} className="ibg" >Restart</button>
        <br />
        <button onClick={() => dispatch(giveupGame(null))} style={buttonBg} className="ibg">Giveup</button>
      </div>
      <div className="title z1"> {APP_NAME} </div>
      <div className="logo z1">
        <img src={`${process.env.PUBLIC_URL}/assets/jis.png`} alt="" />

      </div>
    </>
  );
};

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
          <ScoreBoard username={username} score={score} />
        </div>
        <div className="game-controls">
          <GameOptions />
        </div>
      </div>
    </section>
  );
};
