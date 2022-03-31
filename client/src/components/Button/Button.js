import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

const Button = ({ children, className, onClick, variant }) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[`button_${variant}`],
        className
      )}
      onClick={onClick}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      {children}
    </button>
  );
};

export default Button;
