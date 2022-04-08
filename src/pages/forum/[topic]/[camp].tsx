import { Fragment } from "react";

import Layout from "../../../hoc/layout";
import CampForumComponent from "../../../components/ComponentPages/CampForum";

function CampForumPage() {
  return (
    <Fragment>
      <Layout routeName={"forum"}>
        <div className="">
          <CampForumComponent />
        </div>
      </Layout>
    </Fragment>
  );
}

CampForumPage.displayName = "CampForumPage";

export default CampForumPage;
