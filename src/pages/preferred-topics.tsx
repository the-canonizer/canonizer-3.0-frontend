import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Layout from "src/hoc/layout";
import PreferedTopics from "components/ComponentPages/Home/PreferedTopic";
import { createToken } from "src/network/api/userApi";
import { setPrefTopic } from "src/store/slices/hotTopicSlice";
import { GetPreferedTopicDetails } from "src/network/api/topicAPI";

const RegistrationUserPreferences = ({ prefData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPrefTopic(prefData));
  }, []);

  return (
    <Layout className="min-h-screen">
      <PreferedTopics isPage={true} />
    </Layout>
  );
};

export async function getServerSideProps({ req }) {
  let token = null;

  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const prefData = await GetPreferedTopicDetails(1, -1, token as string);

  return {
    props: {
      prefData: prefData?.data?.items ? prefData?.data?.items : null,
    },
  };
}

RegistrationUserPreferences.displayName = "RegistrationPage";

export default RegistrationUserPreferences;
