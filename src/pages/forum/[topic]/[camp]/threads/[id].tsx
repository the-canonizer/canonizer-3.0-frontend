import { Fragment } from "react";

import { useDispatch } from "react-redux";
import {
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import {
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "../../../../..//store/slices/campDetailSlice";
import Layout from "../../../../../hoc/layout";
import CampForumComponent from "../../../../../components/ComponentPages/CampForum";

function CampForumPostPage({ topicRecord, campRecord }) {
  const dispatch = useDispatch();
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));
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
export async function getServerSideProps({ req, res, resolvedUrl }) {
  let topicNum = +resolvedUrl?.split("/")[2].split("-")[0];
  let campNum = +(resolvedUrl?.split("/")[3].split("-")[0] ?? 1);
  const reqBody = {
    topic_num: topicNum,
    camp_num: campNum,
    as_of: req.cookies["asof"] ?? "default",
    as_of_date:
      req.cookies["asofDate"] && req.cookies["asof"] == "bydate"
        ? parseFloat(req.cookies["asofDate"])
        : Date.now() / 1000,
  };

  const [topicRecord, campRecord] = await Promise.all([
    getCurrentTopicRecordApi(reqBody, req.cookies["authToken"]),
    getCurrentCampRecordApi(reqBody, req.cookies["authToken"]),
  ]);

  return {
    props: {
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
    },
  };
}

CampForumPostPage.displayName = "CampForumPage";

export default CampForumPostPage;
