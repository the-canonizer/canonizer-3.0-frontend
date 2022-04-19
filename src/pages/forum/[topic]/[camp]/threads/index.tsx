import { Fragment } from "react";

import Layout from "../../../../../hoc/layout";
import CampForumComponent from "../../../../../components/ComponentPages/CampForum";

function CampForumListPage() {
  return (
    <Fragment>
      <Layout routeName={"forum"}>
        <div className="" style={{ width: "100%" }}>
          <CampForumComponent />
        </div>
      </Layout>
    </Fragment>
  );
}

CampForumListPage.displayName = "CampForumPage";

export default CampForumListPage;
