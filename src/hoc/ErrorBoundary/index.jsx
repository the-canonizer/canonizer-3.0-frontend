import React, { Component } from "react";
import Image from "next/image";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    if (error.name === "ChunkLoadError") {
      return window.location.reload();
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error_boundary_banner">
          <h1 className="erro_msg">
            Whoops. Something went wrong,
            <br /> please refresh and try again.
          </h1>
          <button
            className="refresh_btn"
            onClick={() => window.location.reload()}
          >
            <Image
              className="redo_icon"
              src="https://d2jyir0m79gs60.cloudfront.net/Refresh-icon.svg"
              alt="refresh"
            />
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
