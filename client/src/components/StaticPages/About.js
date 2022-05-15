import React, { useRef, useEffect } from "react";
import { Helmet } from "react-helmet";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";

const About = () => {
  const faqRef = useRef();

  useEffect(() => {
    if (faqRef && window.location.href.includes("#FAQ")) {
      scrollToFAQ();
    }
  }, [faqRef, window.location.href]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToFAQ = () => {
    faqRef.current.scrollIntoView();
  };
  return (
    <Paper className="about-holder">
      <Helmet>
        <title>About & FAQ | Fact or Fiction</title>
      </Helmet>
      <div className="heading">
        <h1>About Us</h1>
        <h2>Fixing politics through friendly competition</h2>
      </div>
      <div className="text">
        <p>
          A healthy democracy relies on an informed citizenry; however, it’s no
          secret that in recent years there has been an increasing amount of
          misinformation and fact-free arguments dominating the political
          conversation here in the USA.
        </p>

        <p>
          Now that a majority of adults rely on social media algorithms to
          determine their news, individuals on both ends of the political
          spectrum have become increasingly siloed in their information bubbles
          and unwilling to explore opposing viewpoints that are necessary to
          building a better understanding of complex issues. As a result, trust
          between red and blue America has slowly eroded, which has led to
          increasing polarization both in Washington and over the dinner table.
        </p>

        <p>This is a problem. </p>

        <p>
          I believe we must act now to improve news literacy, reduce
          partisanship, and ensure that political dialogue is based in reality.
          Politics can often be confusing, but by breaking it down into concise
          and indisputable facts that serve as the building blocks for
          understanding, then it will be much easier to have an honest and
          substantive debate about the future of the country and how to solve
          our biggest challenges.
        </p>

        <p>
          Believe it or not, the vast majority of Americans, regardless of party
          affiliation, have the same appreciation for learning new facts and
          genuinely want to engage those on the other side of the aisle in
          constructive conversation. That is why I created this site – to give
          passionate voters of all backgrounds a platform to challenge
          themselves and each other, while also building a common consensus of
          political facts through a friendly competition.
        </p>

        <p>
          If you support this mission and want to help bridge the growing
          divide, then please invite your friends and foes alike to take part in
          Fact or Fiction. The more who contribute by playing, challenging
          questions, and submitting their own, the better!
        </p>

        <p style={{ marginTop: "8vh" }}>
          Otherwise, thank you for your interest and feel free to reach out at{" "}
          <a href="mailto: info@whatsmypolitiq.com">info@whatsmypolitiq.com</a>{" "}
          with any questions or feedback!
        </p>

        <p>Connor</p>
      </div>
      <div ref={faqRef} className="heading" style={{ height: "20vh" }}>
        <h1>Frequently Asked Questions</h1>
      </div>
      <div className="text">
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>What is the point of Fact or Fiction?</h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>In short, to remind folks that objective truth exists.</p>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>Where do you get your questions from?</h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>
              The goal is for users to generate the majority of the site’s
              content, so please be sure to submit your own questions for
              approval if you have not already done so!
            </p>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>
              How do you decide which submitted questions are accepted and
              posted to the site?{" "}
            </h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>
              Submitted and contested questions are reviewed by a team of
              individuals who fall on both sides of the political spectrum. If
              you submitted a question that was not accepted by our panel, it is
              likely because: the source of information was not legitimate; the
              question was misleading or not political in focus; a similar
              question already exists or was previously generated by a member of
              our team. Please note that it is entirely within our discretion to
              accept or reject any questions that are submitted, however we hope
              that does not discourage anyone from contributing.{" "}
            </p>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>How are my scores calculated?</h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>
              Your rank on the individual leaderboards is based on your longest
              streak during that particular time period (week, month, all time).
              The team scores are calculated by averaging the longest individual
              streaks from every user belonging to that particular party. Users
              who decide not to affiliate their profile with one of the three
              party options will not have their scores reflected in the team
              leaderboard.
            </p>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>What qualifies as a legitimate source?</h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails
            style={{ display: "flex", flexDirection: "column" }}
          >
            <p>
              Please use the below guidelines when submitting a question. If
              you’re unsure if a source is valid, then submit the question and
              we will respond with feedback if an additional citation is
              required.
            </p>
            <div style={{ marginLeft: "1rem" }}>
              <p style={{ margin: 0 }}>Acceptable sources:</p>
              <ul>
                <li>Reliable news article</li>
                <li>Primary sources</li>
                <li>Scholarly article, poll, survey</li>
              </ul>
              <p style={{ margin: 0 }}>Unacceptable sources:</p>
              <ul>
                <li>Personal anecdotes or opinions</li>
                <li>A YouTube video (without citations)</li>
                <li>Social media posts</li>
              </ul>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>How do I delete my account?</h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>
              Go to your profile page, click “Edit Profile” and then “Delete
              Account”. This will remove your profile and data from the site.{" "}
            </p>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <h3>How do I reach out if I have a question or concern? </h3>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <p>
              Email{" "}
              <a href="mailto:info@whatsmypolitiq.com">
                info@whatsmypolitiq.com
              </a>{" "}
              and we will try and get back to you ASAP.{" "}
            </p>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </Paper>
  );
};

export default About;
