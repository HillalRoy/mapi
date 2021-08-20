import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getUsername, setUsername } from "../store/reducers";

import "./name-register.scss";
export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const username = useAppSelector(getUsername);
  const usernameRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (username !== "") history.push("/play");
  }, [username, history]);

  return (
    <div id="name-register">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          usernameRef.current &&
            dispatch(setUsername(usernameRef.current.value));
        }}
        action="none"
      >
        <input
          ref={usernameRef}
          type="text"
          placeholder="Enter Your Name"
          name="name"
          id="name"
        />
        <input type="submit" name="summit" value="START" id="submit" />
      </form>
    </div>
  );
};
