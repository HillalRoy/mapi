import { motion, Variants } from "framer-motion";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { audioEngine } from "../audios/audioEngine";
import { GameOptions } from "../components/GameOptions";
import { Hints } from "../components/Hints";
import { StreetView } from "../components/StreetViewer";
import { APP_NAME } from "../Constants";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTimer } from "../hooks/timer";
import { auth } from "../store/Firebase";
import {
  getCurCountryCode,
  getGameState,
  getScore,
  getShowAns,
  getShowHints,
  giveupGame,
  restartGame,
  RESTART_TIMER,
  showAnsThunk,
  showHints,
} from "../store/GameReducers";
import { getUI, setUI } from "../store/UIReducer";
import {
  getHighScore,
  getUsername,
  getUserUid,
  setNewHighScoreThunk,
} from "../store/UserReducers";
import { Time } from "../utils/Timer";
import { sleep } from "../utils/tools";
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
  const shownHints = useAppSelector(getUI.showHints);

  // const expiryTimestamp = useMemo(() =>  , [])

  const { seconds, minutes, pause, resume, isRunning, restart, timePast } =
    useTimer({
      // expiryTimestamp: new Date().getTime() + 300_000,
      expiryTimestamp: Time.minutes(2),

      onExpire: () => {
        dispatch(showAnsThunk(""));
      },
    });
  // console.log(`timePast: ${timePast}`);
  useEffect(() => {
    const listener = async () => {
      await sleep(200); // the event calling from reducer
      restart();
      dispatch(setUI.showHints(false));
    };

    document.addEventListener(RESTART_TIMER, listener);
    return () => document.removeEventListener(RESTART_TIMER, listener);
  }, [dispatch, restart]);

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

  // TODO if(timePast === Time.second(30)) show hint ui if not shown alredy
  if (
    !shownHints &&
    timePast === Time.seconds(90) 
  ) {
    dispatch(setUI.showHints(true));
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
        <Hints />
      </div>
    </>
  );
};

const GameOverOverLay = () => {
  const showHint = useAppSelector(getShowHints);
  const dispatch = useAppDispatch();
  const place = useAppSelector(getCurCountryCode);
  return (
    <div
      onClick={() => dispatch(showHints(false))}
      className={`game-over ${showHint ? "show" : "hide"}`}
    >
      <div
        style={{ width: "35%", backgroundColor: "#663036", padding: "2rem" }}
        className="card"
      >
        <img
          style={{
            width: "100%",
          }}
          src={`/assets/map/${place.toLocaleLowerCase()}/vector.svg`}
          alt=""
        />
      </div>
    </div>
  );
};

const StyledLoadingDiv = styled(motion.div)<{
  "bg-color": string;
  "z-index"?: number;
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props["bg-color"] || "#334400"};
  z-index: ${(props) => props["z-index"] ?? 1};
  overflow: hidden;
`;

const loadingVriants: Variants = {
  visible: {
    zIndex: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.15,
      staggerDirection: 1,
    },
  },
  hidden: {
    zIndex: -1,
    transition: {
      delayChildren: 0.3,
      duration: 0.5,
      staggerDirection: -10,
      when: "afterChildren",
    },
  },
};
const itemVriants: Variants = {
  visible: {
    width: "100%",
    transition: {
      duration: 0.3,
    },
  },
  hidden: {
    width: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const LoadingStreatView = () => {
  const show = useAppSelector(
    (s) => !(getGameState.placeViewState(s) === "loaded")
  );

  return (
    <>
      <StyledLoadingDiv
        initial="hidden"
        exit="hidden"
        animate={show ? "visible" : "hidden"}
        variants={loadingVriants}
        bg-color="transparent"
      >
        <StyledLoadingDiv variants={itemVriants} bg-color="#330022" />
        <StyledLoadingDiv variants={itemVriants} bg-color="#730022" />
      </StyledLoadingDiv>
    </>
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
        <LoadingStreatView />
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
