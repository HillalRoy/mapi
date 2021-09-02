import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

import "./name-register.scss";
import firebase from "firebase";
import { startNewGame } from "../store/GameReducers";
import { auth } from "../store/Firebase";
import BtnGoogleLignt from "../img/btn_google_light.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { audioEngine } from "../audios/audioEngine";
import { useState } from "react";
import { getUsername, setUsername } from "../store/UserReducers";
const LoginBtns = () => {
  const googleLogin = async () => {
    audioEngine.firstUserInteraction();
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };
  const signInAnonymously = async () => {
    audioEngine.firstUserInteraction();
    try {
      await auth.signInAnonymously();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="a-login login-btn" onClick={signInAnonymously}>
        {/* <img src={BtnGoogleLignt} alt="" /> */}
        <span> Login with Nick Name </span>
      </button>
      <button className="g-login login-btn" onClick={googleLogin}>
        <img src={BtnGoogleLignt} alt="" />
        <span> Login with Google </span>
      </button>
    </div>
  );
};

export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const username = useAppSelector(getUsername)
  const [user, loading, error] = useAuthState(auth);
  const play = () => {
    dispatch(startNewGame(null));
    history.push("/play");
  };
  
  const [nickName, setNickName] = useState("")
  const playWithNickName =() => {
    if(nickName ===""){
    
      return
    }

    dispatch(setUsername({username: nickName}))
    // play()
    // play()
  }

  if(loading){
    return <div >
      <div style={{ background: "white" }} className="loading"> 
        Loding...
      </div>
    </div>
  }
  return (
    <div id="name-register">
      {user !== null ? (
        <div>
          {username === "" ? (
            <>
              <input style={{display: "block", width: "100%"}} type="text" value={nickName} onChange={e=>setNickName(e.target.value)} />
              <button onClick={playWithNickName} className="play btn">
                Ready to Play
              </button>
            </>
          ) : (
            <>
              <div className="name">Hi! {user?.displayName}</div>
              <button onClick={play} className="play btn">
                Ready to Play
              </button>
            </>
          )}
        </div>
      ) : (
        <LoginBtns />
      )}
      {error && <div className="error"> {error.message} </div>}
    </div>
  );
};
