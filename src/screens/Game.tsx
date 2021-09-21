import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import { audioEngine } from "../audios/audioEngine";
import { GameOptions } from "../components/GameOptions";
import { Hints } from "../components/Hints";
import { StreetView } from "../components/StreetViewer";
import { APP_NAME } from "../Constants";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTimer } from "../hooks/timer";
import { auth } from "../store/Firebase";
import {
  getCurCountry,
  getCurCountryCode,
  getPlaces,
  getScore,
  getShowAns,
  getShowHints,
  giveupGame,
  restartGame,
  RESTART_TIMER,
  showAnsThunk,
  showHints,
  submitAns,
} from "../store/GameReducers";
import {
  getHighScore,
  getUsername,
  getUserUid,
  setNewHighScoreThunk,
} from "../store/UserReducers";
import { Time } from "../utils/Timer";
import "./game.scss";

const buttonBg = { backgroundImage: "url('/assets/buttonbg.png')" };
const statusBg = { backgroundImage: "url('/assets/statusbg.png')" };

const ScoreBoard: React.FC<{ username: string; score: number }> = ({
  username,
  score,
}) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isPause = useAppSelector(getShowAns);
  const highScore = useAppSelector(getHighScore);
  const userUid = useAppSelector(getUserUid);

  // const expiryTimestamp = useMemo(() =>  , [])

  const { seconds, minutes, pause, resume, isRunning, restart } = useTimer({
    // expiryTimestamp: new Date().getTime() + 300_000,
    expiryTimestamp: Time.minutes(2),

    onExpire: () => {
      dispatch(showAnsThunk(''));
    },
  });
  useEffect(() => {
    const listener = () => {
      restart();
    };

    document.addEventListener(RESTART_TIMER, listener);
    return () => document.removeEventListener(RESTART_TIMER, listener);
  }, [restart]);

  if (isPause && isRunning) {
    pause();
  } else if (!isPause && !isRunning) {
    resume();
  }
  if (score > highScore) {
    dispatch(
      setNewHighScoreThunk({ newHighScore: score, id: userUid, username })
    );
  }

  return (
    <>
      <div className="stats">
        <div style={statusBg} className="usrname stats__item ibg">
          {username}
        </div>

        <div style={statusBg} className="score stats__item ibg">
          Score: {score}
        </div>

        <div style={statusBg} className="score stats__item ibg">
          Time: {minutes}:{seconds.toString().padStart(2, "0")}
        </div>

        <button
          onClick={() => {
            dispatch(restartGame(null));
            audioEngine.play(audioEngine.onClick);
          }}
          style={buttonBg}
          className="ibg"
        >
          Restart
        </button>
        <br />
        <button
          onClick={() => {
            dispatch(giveupGame(null));
            audioEngine.play(audioEngine.onClick);
            history.goBack();
          }}
          style={buttonBg}
          className="ibg"
        >
          Giveup
        </button>
      </div>
      <div className="title z1"> {APP_NAME} </div>
      <div className="logo z1">
        <img src={`${process.env.PUBLIC_URL}/assets/jis.png`} alt="" />
        <Hints/>
      </div>
    </>
  );
};

const GameOverOverLay = () => {
  const showHint = useAppSelector(getShowHints);
  const dispatch = useAppDispatch()
  const place = useAppSelector(getCurCountryCode)
  return (
    <div
      onClick={() => dispatch(showHints(false))}
     className={`game-over ${showHint ? "show" : "hide"}`}>

      <div style={{ width: "35%", backgroundColor: "#663036", padding: "2rem"}}  className="card">
          <img style={{
            width: "100%"
          }} src={`/assets/map/${place.toLocaleLowerCase()}/vector.svg`} alt="" />
      </div>
    </div>
  );
};
export const GamePage = () => {
  const username = useAppSelector(getUsername);
  const history = useHistory();
  const [user] = useAuthState(auth);
  if (user === null) history.replace("/");
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
      <div className="overlay">
        <GameOverOverLay />
      </div>
    </section>
  );
};
