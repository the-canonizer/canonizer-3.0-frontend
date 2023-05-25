"use client";

import { Fragment } from "react";

import CampForumComponent from "src/components/ComponentPages/CampForum";

function CampForumListPage() {
  return (
    <Fragment>
      <div className="" style={{ width: "100%" }}>
        <CampForumComponent />
      </div>
    </Fragment>
  );
}

CampForumListPage.displayName = "CampForumListPage";

export default CampForumListPage;
