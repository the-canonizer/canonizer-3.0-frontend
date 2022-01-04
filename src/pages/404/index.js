import My404 from "../../components/ComponentPages/404";

import { withRouter } from "next/router";

function My404Page(props) {
  return <My404 router={props.router} />;
}

export default withRouter(My404Page);
