import React from "react";

import Paper from "@material-ui/core/Paper";

import bg from "./politiq-bg2.jpg";

import { NavLink } from "react-router-dom";
import "./Static.css";
import TodaysQuizButton from "./TodaysQuizButton";
import { GAME } from "../../constants/routes";

const LandingPage = () => {
  return (
    <Paper className="home-holder">
      <div className="welcomeHolder">
        <div className="welcomeBlock">
          <h1 id="main">
            Think you know politics<span id="iq">?</span>
          </h1>
          <h2 style={{ fontSize: "20px", marginBottom: "40px" }}>Prove it! </h2>

          <img
            src={bg}
            id="bg-image"
            alt="democrats and republicans face off"
          />

          <h2 style={{ marginBottom: "40px" }}>
            Then, add your score to one of three teams and compare it to other
            users to prove that you and your political party are the most
            informed.
          </h2>
          <div className="title anim-h1">
            <span>Republican?</span>
          </div>

          <div className="title anim-h2">
            <span>Democrat?</span>
          </div>
          <div className="title anim-h3">
            <span>Independent?</span>
          </div>
        </div>
      </div>
      <div className="home-description">
        <h4> INTERESTED IN POLITICS AND CONSTANTLY CONSUMED BY THE NEWS?</h4>
        <p>
          Test your understanding of today’s political climate by answering as
          many questions as you can on a variety of topics related to national
          politics and global affairs. Then compare your score, or political IQ,
          with others to prove that you and your political party are the most
          informed.
        </p>
      </div>

      <div className="how-it-works">
        <h2>
          HOW <span id="it-works">IT WORKS</span>
        </h2>
        <div className="icon-holder">
          <NavLink
            to="/signup"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="icon-div">
              <i className="fas fa-user icon"></i>
              <h6 style={{ whiteSpace: "pre-wrap" }}>Create a Free Profile</h6>
              <p>Sign up and create your user profile, it’s very easy.</p>
            </div>
          </NavLink>
          <NavLink
            to={GAME}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="icon-div">
              <i className="fas fa-pen-square icon"></i>
              <h6>Start Playing</h6>
              <p>
                Answer on your own time. New questions added daily and expire at
                the end of each month.
              </p>
            </div>
          </NavLink>

          <div className="icon-div">
            <i className="fas fa-clipboard icon"></i>
            <h6>Increase Score</h6>
            <p>
              <span style={{ fontWeight: "bold" }}>1 point</span> for correct
              answers, <span style={{ fontWeight: "bold" }}>0 points</span> for
              incorrect answers.
            </p>
          </div>
          <div className="icon-div">
            <i className="fas fa-gift icon"></i>
            <h6>Build team score</h6>
            <p>
              Add your points to one of three team scores. Party with highest
              score at end of each month receives a prize.
            </p>
          </div>
        </div>
      </div>

      <div className="home-description2">
        <h4>
          THINK <span style={{ color: "#a54ee8" }}>ITS BIASED?</span> CONTEST A
          QUESTION OR ADD ONE OF YOUR OWN AND{" "}
          <span style={{ color: "#a54ee8" }}>WIN POINTS</span>
        </h4>
        <p>
          If you believe the answer to a question is incorrect, then submit your
          argument (with a valid source) and you will receive an additional{" "}
          <span style={{ fontWeight: "bold" }}>2 points</span> and the question
          will be fixed. If you wish to submit your own question to be included
          on the site, you can receive an additional{" "}
          <span style={{ fontWeight: "bold" }}>3 points</span> (depending upon
          approval of its content and validity). All are welcome to contribute!
        </p>
        <TodaysQuizButton />
      </div>
    </Paper>
  );
};

export default LandingPage;
