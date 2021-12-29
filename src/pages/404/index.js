import My404 from "../../components/ComponentPages/404";
// import Layout from "../../hoc/Layout";
import { withRouter } from "next/router";
// import '../components/Help/styles.scss'
function My404Page(props) {
  const meta = {
    title: "canonizer",
    description: "Short Description",
    route: "404",
  };

  return (
    // <Layout my404 meta={meta}>
    <My404 router={props.router} />
    // </Layout>
  );
}

export default withRouter(My404Page);
