import Link from "next/link";
import React, { Component } from "react";
import { isServer } from "../../utils/generalUtility";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    if (error.name === "ChunkLoadError") {
      return window.location.reload();
    }
    return { hasError: true, redirect: false };
  }

  componentDidCatch(error, info) {
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
        <h2>
          There was an error with this listing.{" "}
          <Link href="/">
            <a>Click here</a>
          </Link>{" "}
          to back to the home page or wait five seconds.
        </h2>
      );
    }

    return this.props.children;
  }
}
