import { Fragment } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import {
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import {
  getPostsList,
  getThreadData,
} from "../../../../../network/api/campForumApi";
import {
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "../../../../..//store/slices/campDetailSlice";
import Layout from "../../../../../hoc/layout";
import CampForumComponent from "../../../../../components/ComponentPages/CampForum";
import DataNotFound from "@/components/ComponentPages/DataNotFound/dataNotFound";
import { setThread } from "src/store/slices/campForumSlice";
import { createToken } from "src/network/api/userApi";

function CampForumPostPage({
  topicRecord,
  campRecord,
  postList,
  threadData,
  notFoundStatus,
  notFoundMessage,
}: any) {
  const dispatch = useDispatch(),
    router = useRouter();

  dispatch(setThread(threadData));
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));

  return (
    <Fragment>
      <Layout routeName={"forum"}>
        {notFoundStatus ? (
          <DataNotFound
            name="Thread"
            message={notFoundMessage}
            backURL={`/forum/${router?.query?.topic}/${router?.query?.camp}/threads`}
          />
        ) : (
          <div className="" style={{ width: "100%" }}>
            <CampForumComponent
              postlist={postList?.status_code == 200 ? postList?.data : {}}
            />
          </div>
        )}
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

  let token = null;
  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const threadRes = await getThreadData(
    id,
    String(topicNum),
    String(campNum),
    token
  );

  if (threadRes?.data?.status_code === 404) {
    return {
      props: {
        topicRecord: {},
        campRecord: {},
        postList: {},
        threadData: {},
        notFoundStatus: true,
        notFoundMessage: threadRes?.data?.error,
      },
    };
  }

  const [topicRecord, campRecord, postList] = await Promise.all([
    getCurrentTopicRecordApi(reqBody, req.cookies["authToken"]),
    getCurrentCampRecordApi(reqBody, req.cookies["authToken"]),
    getPostsList(id, q, req.cookies["loginToken"] || req.cookies["authToken"]),
  ]);

  return {
    props: {
      topicRecord: topicRecord || {},
      campRecord: campRecord?.campData || {},
      postList: postList || {},
      threadData: threadRes?.data || {},
      notFoundStatus: false,
      notFoundMessage: "",
    },
  };
}

CampForumPostPage.displayName = "CampForumPage";

export default CampForumPostPage;
