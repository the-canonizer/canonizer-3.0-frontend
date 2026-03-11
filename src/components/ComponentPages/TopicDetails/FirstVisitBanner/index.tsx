import React, { useState, useEffect } from "react";
import styles from "./FirstVisitBanner.module.scss";

const STORAGE_KEY = "canonizer_visited";

const FirstVisitBanner = () => {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  const handleDismiss = () => {
    setDismissing(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setTimeout(() => setVisible(false), 200);
  };

  if (!visible) return null;

  return (
    <div className={`${styles.banner} ${dismissing ? styles.bannerHide : ""}`}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </svg>
      <span className={styles.text}>
        New here? Read a position below, then tell us where you stand.
      </span>
      <button className={styles.dismiss} onClick={handleDismiss} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
};

export default FirstVisitBanner;
