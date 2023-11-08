import { Fragment, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import {
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "../../../../..//store/slices/campDetailSlice";
import { getThreadsList } from "../../../../../network/api/campForumApi";
import { useRouter } from "next/router";
import Layout from "../../../../../hoc/layout";
import CampForumComponent from "../../../../../components/ComponentPages/CampForum";

function CampForumListPage({ topicRecord, campRecord, threadList }: any) {
  const router = useRouter();
  const dispatch = useDispatch();
  dispatch(setCurrentTopicRecord(topicRecord));
  dispatch(setCurrentCampRecord(campRecord));
  useEffect(() => {
    if (threadList?.status_code == 404) {
      router?.push(
        router?.asPath?.replace("forum", "topic")?.replace("/threads", "")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Layout routeName={"forum"}>
        <div className="" style={{ width: "100%" }}>
          {threadList?.status_code != "404" && (
            <CampForumComponent
              threadlist={
                threadList?.status_code == 200 ? threadList?.data?.items : []
              }
            />
          )}
        </div>
      </Layout>
    </Fragment>
  );
}
export async function getServerSideProps({ req, resolvedUrl }) {
  let topicNum = +resolvedUrl?.split("/")[2].split("-")[0];
  let campNum = +(resolvedUrl?.split("/")[3].split("-")[0] ?? 1);
  let q = `?camp_num=${campNum}&topic_num=${topicNum}&type=all&page=${1}&per_page=${10}&like=`;
  const reqBody = {
    topic_num: topicNum,
    camp_num: campNum,
    as_of: req.cookies["asof"] ?? "default",
    as_of_date:
      req.cookies["asofDate"] && req.cookies["asof"] == "bydate"
        ? parseFloat(req.cookies["asofDate"])
        : Date.now() / 1000,
  };
  const [topicRecord, campRecord, threadList] = await Promise.all([
    getCurrentTopicRecordApi(reqBody, req.cookies["authToken"]),
    getCurrentCampRecordApi(reqBody, req.cookies["authToken"]),
    getThreadsList(q),
  ]);

  return {
    props: {
      topicRecord: topicRecord || {},
      campRecord: campRecord?.campData || {},
      threadList: threadList || {},
    },
  };
}

CampForumListPage.displayName = "CampForumListPage";

export default CampForumListPage;
