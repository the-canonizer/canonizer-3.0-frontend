"use client";

import { Fragment } from "react";

import CampForumComponent from "src/components/ComponentPages/CampForum/create-thread";

function CampForumCreatePage() {
  return (
    <Fragment>
      <div className="" style={{ width: "100%" }}>
        <CampForumComponent />
      </div>
    </Fragment>
  );
}

CampForumCreatePage.displayName = "CampForumCreatePage";

export default CampForumCreatePage;
