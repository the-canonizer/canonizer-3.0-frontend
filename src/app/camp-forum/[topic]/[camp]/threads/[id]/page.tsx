"use client";
import { Fragment } from "react";

import CampForumComponent from "src/components/ComponentPages/CampForum/forum-post";

function CampForumPostPage() {
  return (
    <Fragment>
      <div className="" style={{ width: "100%" }}>
        <CampForumComponent />
      </div>
    </Fragment>
  );
}

CampForumPostPage.displayName = "CampForumPage";

export default CampForumPostPage;
