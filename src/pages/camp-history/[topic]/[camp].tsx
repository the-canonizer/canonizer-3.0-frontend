import { Fragment } from "react";
import { Alert } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Layout from "../../../hoc/layout";
import { RootState } from "../../../store";

function TopicHistory() {
  const router = useRouter();
  console.log(router.query, "query");

  const createdData = useSelector(
    (state: RootState) => state.topic.currentTopic
  );

  return (
    <Fragment>
      <Layout routeName={"topic-history"}>
        <div className="">
          <h1>Camp</h1>

          {createdData?.message && (
            <Alert message={createdData?.message} type="success" />
          )}
        </div>
      </Layout>
    </Fragment>
  );
}

TopicHistory.displayName = "TopicHistory";

export default TopicHistory;
