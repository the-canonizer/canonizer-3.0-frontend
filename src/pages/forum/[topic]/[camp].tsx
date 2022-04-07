import { Fragment } from "react";

import Layout from "../../../hoc/layout";
import CampForumComponent from "../../../components/ComponentPages/CampForum";

function CampForumPage() {
  return (
    <Fragment>
      <Layout routeName={"forum"}>
        <CampForumComponent />
      </Layout>
    </Fragment>
  );
}

CampForumPage.displayName = "CampForumPage";

export default CampForumPage;
