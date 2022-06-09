import React, { useEffect, useCallback, useRef } from "react";
import styles from "./Toast.module.scss";
const Toast = ({ duration, text, open, onClose }) => {
  const flashInterval = useRef();

  useEffect(() => {
    return clearInterval(flashInterval.current);
  });

  const handleOpen = useCallback(() => {
    if (open) {
      flashInterval.current = setInterval(() => {
        onClose();
      }, duration);
    }
  }, [open, duration, onClose]);

  useEffect(() => {
    handleOpen();
  }, [open, handleOpen]);

  return <>{open && <div className={styles.toast}>{text}</div>}</>;
};

export default Toast;
