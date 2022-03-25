import React, { useState } from "react";

import Paper from "@material-ui/core/Paper";

import bg from "./fof.svg";
import fight from "./politiq-bg2.jpg";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Static.css";
import TodaysQuizButton from "./TodaysQuizButton";
import PrelaunchModal from "./PrelaunchModal";
import { GAME } from "../../constants/routes";

const LandingPage = () => {
  const [prelaunchModalOpen, setPrelaunchModalOpen] = useState(false);
  console.log(process.env.REACT_APP_PRELAUNCH, "ENV");
  console.log(
    process.env.REACT_APP_PRELAUNCH === "true",
    process.env.REACT_APP_PRELAUNCH === true,
    "true, true"
  );
  return (
    <Paper className="home-holder">
      <PrelaunchModal
        open={prelaunchModalOpen}
        onClose={() => setPrelaunchModalOpen(false)}
      />
      <div className="welcomeHolder">
        <div className="welcomeBlock">
          <h1 id="main">Welcome to</h1>
          <img src={bg} id="bg-image" alt="Fact or Fiction Trivia Logo" />
          <p className="subtitle">Think you know politics?</p>
          {process.env.REACT_APP_PRELAUNCH === "true" ? (
            <Button
              onClick={() => setPrelaunchModalOpen(true)}
              variant="primary"
            >
              Prove it.
            </Button>
          ) : (
            <Link to={GAME}>
              <Button variant="primary">Prove it.</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="home-description">
        <p>
          Test your understanding of today’s political climate by answering as
          many questions as you can on a variety of topics related to national
          politics and global affairs. Then compare your score with others to
          prove that you and your political party are the most informed.
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
            <p>Add your points to one of three team/party scores.</p>
          </div>
        </div>
      </div>
      <img src={fight} id="bg-image" alt="democrats and republicans face off" />
      <div className="home-description2">
        <h4>
          THINK <span style={{ color: "#a54ee8" }}>ITS BIASED?</span> CONTEST A
          QUESTION OR ADD ONE OF YOUR OWN AND{" "}
          <span style={{ color: "#a54ee8" }}>AND WIN A PRIZE</span>
        </h4>
        <p>
          If you believe the answer to a question is incorrect, then submit your
          argument (with a valid source) and you will receive an additional{" "}
          <span style={{ fontWeight: "bold" }}>lifeline</span> and the question
          will be fixed. If you wish to submit your own question to be included
          on the site, you can receive an additional{" "}
          <span style={{ fontWeight: "bold" }}>2 lifelines</span> (depending
          upon approval of its content and validity). All are welcome to
          contribute!
        </p>
        {process.env.REACT_APP_PRELAUNCH === "true" ? (
          <Button onClick={() => setPrelaunchModalOpen(true)} variant="primary">
            Play game
          </Button>
        ) : (
          <TodaysQuizButton />
        )}
      </div>
    </Paper>
  );
};

export default LandingPage;
