import React, { Component } from "react";

class My404 extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true, redirect: false };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  componentDidUpdate() {
    if (this.state.hasError) {
      setTimeout(() => this.setState({ redirect: true }), 500);
    }
  }

  goBack = () => {
    this.props.router.back();
  };

  render() {
    if (this.state.redirect) {
      return this.props.router.push("/");
      // return <h1>Bye</h1>;
    } else if (this.state.hasError) {
      // this.setState({ flag: !this.state.flag });
      return (
        <h2>
          There was an error with this listing.{" "}
          <b onClick={this.goBack}>Click here</b> to go back or wait five
          seconds.
        </h2>
      );
    }
    return (
      <h1>
        404 - Page Not Found.
        <b onClick={this.goBack}>Click here</b> to go back.
      </h1>
    );
    // return this.props.children;
  }

  // render() {
  //   return (

  //     // <div className="page-404-container-cls">
  //     //   <div className="page-404-main-content-cls">
  //     //     <div className="flex-item1-404-cls">
  //     //       <div className="main-404-cls">
  //     //         <div className="text-404-cls"> 404</div>
  //     //         <div className="man-404-cls">
  //     //           {/* <img src="/images/my404page/group_5277.svg" /> */}
  //     //         </div>
  //     //       </div>

  //     //       <div className="text-oops-404-cls"> Oops! Page not found</div>
  //     //       <div className="text-main-404-container-cls">
  //     //         <div className="text-main-404-cls">
  //     //           {" "}
  //     //           The page you’re looking for isn’t available use the
  //     //           <b> Go Back</b> button below.
  //     //         </div>
  //     //       </div>
  //     //       <div>
  //     //         <div>
  //     //           <a onClick={this.goBack}>
  //     //             <span>
  //     //               <i className="fa fa-angle-left fa-2x" aria-hidden="true" />
  //     //             </span>
  //     //             <span>Go Back</span>
  //     //           </a>
  //     //         </div>
  //     //       </div>
  //     //     </div>
  //     //   </div>
  //     // </div>

  //  );
  // }
}

export default My404;
