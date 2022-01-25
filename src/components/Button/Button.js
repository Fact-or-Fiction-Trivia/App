import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

const Button = ({ children, onClick, variant }) => {
  return (
    <div
      className={classNames(styles.button, styles[`button_${variant}`])}
      onClick={onClick}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      {children}
    </div>
  );
};

export default Button;
