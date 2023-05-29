"use client";

import { Fragment } from "react";

import CampForumComponent from "src/components/ComponentPages/CampForum/edit-thread";

function CampForumEditPage() {
  return (
    <Fragment>
      <div className="" style={{ width: "100%" }}>
        <CampForumComponent />
      </div>
    </Fragment>
  );
}

CampForumEditPage.displayName = "CampForumEditPage";

export default CampForumEditPage;
