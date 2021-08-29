import { useHistory } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";

import "./name-register.scss";
import firebase from "firebase";
import { startNewGame } from "../store/GameReducers";
import { auth } from "../store/Firebase";
import BtnGoogleLignt from "../img/btn_google_light.svg";
import { useAuthState } from "react-firebase-hooks/auth"
const GoogleLoginBtn = () => {

  const googleLogin = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="g-login btn" onClick={googleLogin}>
      <img src={BtnGoogleLignt} alt="" />
      <span> Login with Google </span>
    </button>
  );
};

export const NameRegister = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [user, loading, error] = useAuthState(auth)
  const play = () => {
    dispatch(startNewGame(null));
    history.push("/play");
  };



  return <div id="name-register">
      {user !== null ? <div>
          <div className="name">{user?.displayName}</div>
          <button className="play btn">Ready to Play</button>
      </div> : <GoogleLoginBtn/>}
      {error && <div className="error"> {error.message} </div>}
  </div>;
};
