import React, { useEffect, useCallback, useRef } from "react";
import classNames from "classnames";
import styles from "./Toast.module.scss";
const Toast = ({ duration, filled, text, open, onClose, variant }) => {
  const flashInterval = useRef();

  useEffect(() => {
    return clearInterval(flashInterval.current);
  });

  const handleOpen = useCallback(() => {
    if (open) {
      flashInterval.current = setInterval(() => {
        onClose && onClose();
      }, duration);
    }
  }, [open, duration, onClose]);

  useEffect(() => {
    handleOpen();
  }, [open, handleOpen]);

  return (
    <>
      {open && (
        <div
          className={classNames(
            styles.toast,
            filled
              ? styles[`toast-filled-${variant}`]
              : styles[`toast-${variant}`]
          )}
        >
          {text}
        </div>
      )}
    </>
  );
};

export default Toast;
