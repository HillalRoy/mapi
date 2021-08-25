import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getUsername, setUsername } from "../store/UserReducers";

import "./name-register.scss";
import firebase from "firebase";
import { startNewGame } from "../store/GameReducers";
export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const username = useAppSelector(getUsername);
  const [usernameInputVal, onUsernameChange] = useState("");
  const [errorMsg, setError] = useState("");
  const play = () => {
    dispatch(startNewGame(null))
    history.push("/play");
  }
  const onPlay = async () => {
    if (usernameInputVal !== "") {
      try {
        const users = firebase.firestore().collection("users");
        const res = await users.add({ username: usernameInputVal, highScore: 0 });
        dispatch(setUsername({username:usernameInputVal, uid: res.id}));
        play();
      } catch (error) {
        setError("Try again");
        console.log({ error });
      }
    } else if (username !== "") play();
  };

  return (
    <div id="name-register">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPlay();
        }}
        action="none"
      >
        {username === "" ? (
          <>
            <input
              value={usernameInputVal}
              onChange={(e) => onUsernameChange(e.target.value)}
              type="text"
              placeholder="Enter Your Name"
              name="name"
              id="name"
              autoComplete="off"
            />
            <div className="error">{errorMsg}</div>
          </>
        ) : (
          <div className="username"> {username} </div>
        )}
        {/* <input type="submit" name="summit" value="START" id="submit" /> */}
        <button type="submit">
          {" "}
          <img src={`${process.env.PUBLIC_URL}/assets/start.png`} alt="" />{" "}
        </button>
      </form>
    </div>
  );
};
