import "./home.scss";
import React from "react";
import { APP_NAME, APP_SLOGAN } from "../Constants";
import { NameRegister } from "../components/NameRegister";
import { Leadboad } from "../components/Leadboad";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../store/Firebase";
import { audioEngine } from "../audios/audioEngine";

const Header = () => {
  const [user] = useAuthState(auth)
  const logout = () =>  {
    auth.signOut()
    audioEngine.allStop()
  }
  
  return (
    <div className="hedding">
      <div className="menu"></div>
      <div className="hedding__middle">
        <div id="jis-logo">
          <img src={`${process.env.PUBLIC_URL}/assets/jis.png`} alt="" />
        </div>
        <div id="app-title">{APP_NAME}</div>
        <div id="slogan">{APP_SLOGAN}</div>
      </div>
      <div className="user">
        <div className="logout">
          { user && <button onClick={logout} className="btn">Logout</button> }
          <div className="placeholder"></div>
        </div>
      </div>
    </div>
  );
};

export const HomePage = () => {
  return (
    <section
      style={{ backgroundImage: "url('/assets/wallpaper.png')" }}
      id="home"
      className="screen"
    >
      <Header/>
      <div className="bottom">
        <Leadboad />

        <NameRegister />
      </div>
    </section>
  );
};
