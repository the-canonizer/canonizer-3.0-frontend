import { Fragment } from "react";
import { Alert } from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Layout from "../../hoc/layout";
import { RootState } from "../../store";

export default function TopicHistory() {
  const router = useRouter();

  const createdData = useSelector(
    (state: RootState) => state.topic.currentTopic
  );

  return (
    <Fragment>
      <Layout routeName={"topic-history"}>
        <div className="">
          <h1>Topic</h1>

          {createdData?.message && (
            <Alert message={createdData?.message} type="success" />
          )}

          <button onClick={() => router.push("/create-new-camp")}>
            Create Camp
          </button>
        </div>
      </Layout>
    </Fragment>
  );
}
