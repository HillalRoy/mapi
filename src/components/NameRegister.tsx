import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getUsername, setUsername } from "../store/UserReducers";

import "./name-register.scss";
import firebase from "firebase";
export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const username = useAppSelector(getUsername);
  const [usernameInputVal, onUsernameChange] = useState("");
  const [errorMsg, setError] = useState("");

  const play = async () => {
    if (usernameInputVal !== "") {
      try {
        const users = firebase.firestore().collection("users");
        const exist = await users
          .where("username", "==", usernameInputVal)
          .get();
        if (!exist.empty) {
          // exitst
          setError("Username alredy exist!!");

          return;
        }
        const res = await users.add({ username: usernameInputVal });
        console.log(res);

        dispatch(setUsername(usernameInputVal));
        history.push("/play");
      } catch (error) {
        setError("Try again");
        console.log({ error });
      }

      // play();
    } else if (username !== "") history.push("/play");
  };

  return (
    <div id="name-register">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          play();
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
