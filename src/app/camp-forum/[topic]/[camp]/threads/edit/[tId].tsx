import { Fragment } from "react";

import Layout from "../../../../../../hoc/layout";
import CampForumComponent from "../../../../../../components/ComponentPages/CampForum";

function CampForumEditPage() {
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

CampForumEditPage.displayName = "CampForumEditPage";

export default CampForumEditPage;
