import React from "react";
import classNames from "classnames";
import styles from "./Button.module.scss";

const Button = ({ children, className, onClick, variant }) => {
  return (
    <div
      className={classNames(
        styles.button,
        styles[`button_${variant}`],
        className
      )}
      onClick={onClick}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      {children}
    </div>
  );
};

export default Button;
