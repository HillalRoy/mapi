import React from "react";
import { APP_NAME } from "../Constants";
import "./game.scss";

export const GamePage = () => {
  return (
    <section id="game-page" className="screen">
      <div id="game-view"></div>
      <div className="top">
        <div className="stats">

            <button>

                Restart
            </button>
            <button>Giveup</button>
        </div>
        <div className="title"> {APP_NAME} </div>
        <div className="logo"></div>
      </div>
      <div className="game-controls">
        <div className="options">
          <button>buut</button>
          <button>buut</button>
          <button>buut</button>
          <button>buut</button>
        </div>
      </div>
    </section>
  );
};
