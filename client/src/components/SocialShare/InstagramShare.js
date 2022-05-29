import React, { useRef } from "react";
import { connect } from "react-redux";
import { getAnalytics, logEvent } from "firebase/analytics";
import { Dialog, Slide } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Button from "../../components/Button/Button";
import { exportComponentAsPNG } from "react-component-export-image";
import styles from "./InstagramShare.module.scss";
import owl from "../../images/large_icon.png";
import logo from "../../assets/images/FoFHorizontalLogo.png";

// We need to generate an image for instagram to share
// We want this image to reflect the user's highest streak.
// We need to render a react component with the user's streak
// and then allow the user to save and share that image.

// it's not seamless but it will work as a v0

// when the user clicks on the instagram share button, it will open a modal
// in the modal, the user will be able to view the image
// and then click 'save and share'
// the image will be saved to their device, and they'll be able to share it.

// ideal case: user just clicks share from the end of streak page
// in the modal, they can click the platform where they want to share the image.
// for this proof of concept, it'll just be for instagram.

// in a v1 of this, we can generate the images, save the pngs to an s3 bucket,
// and grab them directly in our app so we can use the mobile share sheet

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const InstagramShare = ({
  handleClose,
  highestStreak,
  open,
  shareText,
  streakLength,
}) => {
  const analytics = getAnalytics();

  const string1 = shareText.split("?")[0] + "?";
  const string2 = shareText.split("?")[1];
  const componentRef = useRef();

  const handleDownload = () => {
    exportComponentAsPNG(componentRef, { w: 1080, h: 1920 });
    logEvent(analytics, "instagram_share", { event_name: "image_downloaded" });
    handleClose();
  };
  return (
    <Dialog
      aria-labelledby="share_modal"
      aria-describedby="share_modal_header"
      className={styles.shareModal}
      open={open}
      onClose={handleClose}
      fullScreen
      TransitionComponent={Transition}
      scroll="body"
    >
      <div className={styles.modalContent}>
        <Close className={styles.close} onClick={handleClose} />
        <div className={styles.shareImage} ref={componentRef}>
          <img className={styles.logo} src={logo} alt="Fact or Fiction Logo" />
          <div className={styles.shareImageInner}>
            <h2>{string1}</h2>
            <div className={styles.streakContainer}>
              <img src={owl} alt="Fact or Fiction Owl" />
              <h2 className={styles.streak}>
                {streakLength > highestStreak ? streakLength : highestStreak}
              </h2>
            </div>
            <h2>{string2}</h2>
          </div>
        </div>
        <Button className={styles.download} onClick={handleDownload}>
          Download to Share
        </Button>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { maxStreak, streak } = state.streak;
  return {
    highestStreak: maxStreak,
    streakLength: streak.filter((it) => it.answeredCorrectly).length,
  };
};

export default connect(mapState)(InstagramShare);
