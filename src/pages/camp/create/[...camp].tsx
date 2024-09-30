import CreateNewCamp from "components/ComponentPages/CreateNewCamp";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Layout from "src/hoc/layout";
import {
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "src/network/api/campDetailApi";
import { createToken } from "src/network/api/userApi";
import {
  setCurrentCampRecord,
  setCurrentTopicRecord,
} from "src/store/slices/campDetailSlice";
import { formatTheDate } from "src/utils/generalUtility";

const CreateNewCampPage = ({ topicRecord, campRecord }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTopicRecord(topicRecord));
    dispatch(setCurrentCampRecord(campRecord?.campData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout routeName={"create-camp"}>
      <CreateNewCamp />
    </Layout>
  );
};

CreateNewCampPage.displayName = "CreateNewCampPage";

export async function getServerSideProps({ req, query }) {
  let topicNum = query?.camp[0]?.split("-")[0];
  let campNum = query?.camp[1]?.split("-")[0] || 1;
  let token = null;

  const reqBody = {
    topic_num: topicNum,
    camp_num: campNum,
    as_of: query?.asof ?? "default",
    as_of_date:
      query?.asofdate && query?.asof == "bydate"
        ? formatTheDate(query?.asofdate * 1000, "DD-MM-YYYY H:mm:ss")
        : Date.now() / 1000,
  };

  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const [topicRecord, campRecord] = await Promise.all([
    getCurrentTopicRecordApi(reqBody, token),
    getCurrentCampRecordApi(reqBody, token),
  ]);

  return {
    props: {
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
      serverCall: true,
    },
  };
}

export default CreateNewCampPage;
