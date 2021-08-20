import "./home.scss";
import React from "react";
import { APP_NAME, APP_SLOGAN } from "../Constants";
import { NameRegister } from "../components/NameRegister";
import { Leadboad } from "../components/Leadboad";
export const HomePage = () => {
  return (
    <section style={{backgroundImage: "url('/assets/wallpaper.png')"}} id="home" className="screen">
      <div className="hedding">
        <div id="jis-logo">
         <img src={`${process.env.PUBLIC_URL}/assets/jis.png`} alt="" />
        </div>
        <div id="app-title">{APP_NAME}</div>
        <div id="slogan">{APP_SLOGAN}</div>
      </div>
      <div className="bottom">
        <Leadboad/>
        <NameRegister/>
      </div>
    </section>
  );
};
