import Link from "next/link";
import React, { Component } from "react";
import { isServer } from "../../utils/generalUtility";

import Image from "next/image";

import styles from "./errorPage.module.scss";

export default class ErrorBoundary extends Component {
  state = { hasError: false, redirect: false };

  static getDerivedStateFromError(error) {
    if (error.name === "ChunkLoadError") {
      return window.location.reload();
    }
    return { hasError: true, redirect: false };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error", error, info);
  }

  componentDidUpdate() {
    if (this.state.hasError) {
      setTimeout(() => this.setState({ redirect: true }), 5000);
    }
  }

  redirectToHome = () => {
    return !isServer && (window.location.href = "/");
  };

  render() {
    if (this.state.redirect) {
      return this.redirectToHome();
    } else if (this.state.hasError) {
      return (
        <>
          <div className={styles.errorPageContentWrap}>
            <div className={styles.errorPageImg}>
              <Image
                src={"/images/error-boundary-img.png"}
                alt="error boundry"
                width={487}
                height={552}
              />
            </div>
            <div className={styles.errorPageContent}>
              <h2>Oops!</h2>
              <h3>Something went wrong</h3>
              <p>
                <Link href="/">Click here</Link> to go back to the home page or
                wait five seconds.
              </p>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
