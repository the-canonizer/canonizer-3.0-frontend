import CreateNewTopic from "../components/ComponentPages/CreateNewTopic";

import Layout from "../hoc/layout";

const CreateNewTopicPage = () => {
  return (
    <>
      <Layout routeName={"create-new-topic"}>
        <CreateNewTopic />
      </Layout>
    </>
  );
};

export default CreateNewTopicPage;