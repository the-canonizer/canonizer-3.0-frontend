import { Fragment } from "react";

import { useDispatch } from "react-redux";
import {
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { getPostsList } from "../../../../../network/api/campForumApi";
import {
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "../../../../..//store/slices/campDetailSlice";
import Layout from "../../../../../hoc/layout";
import CampForumComponent from "../../../../../components/ComponentPages/CampForum";

function CampForumPostPage({ topicRecord, campRecord, postList }: any) {
  const dispatch = useDispatch();
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));
  return (
    <Fragment>
      <Layout routeName={"forum"}>
        <div className="" style={{ width: "100%" }}>
          <CampForumComponent
            postlist={postList?.status_code == 200 ? postList?.data : {}}
          />
        </div>
      </Layout>
    </Fragment>
  );
}
export async function getServerSideProps({ req, resolvedUrl }) {
  let id = resolvedUrl?.split("/")[5];
  let q = `?page=${1}&per_page=${10}&like=`;
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

  const [topicRecord, campRecord, postList] = await Promise.all([
    getCurrentTopicRecordApi(reqBody, req.cookies["authToken"]),
    getCurrentCampRecordApi(reqBody, req.cookies["authToken"]),
    getPostsList(id, q),
  ]);

  return {
    props: {
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
      postList: postList || {},
    },
  };
}

CampForumPostPage.displayName = "CampForumPage";

export default CampForumPostPage;
