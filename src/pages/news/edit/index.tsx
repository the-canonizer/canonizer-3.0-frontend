import FormDataupdate from "../../../components/addnewsformdata/formupdate";
import Layout from "../../../hoc/layout";
import SideBar from "../../../components/ComponentPages/Home/SideBar";
import { editNewsFeedApi } from "../../../network/api/addupdateNewsApi";
import React, { useState } from "react";
export default function Home({ res }) {
  console.log("updatenews.js page data 1=> ", res.data);
  const [update, setUpdate] = useState(res.data);

  return (
    <>
      {res.data !== "error" && (
        <Layout routeName={"edit-news"}>
          <aside className="leftSideBar miniSideBar">
            <SideBar />
          </aside>
          <div className="pageContentWrap">
            <FormDataupdate update={update} />
          </div>
        </Layout>
      )}
      {res.data === "error" && (
        <Layout>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              marginLeft: "150px",
            }}
          >
            <div>
              <h1>OOP! Wrong URL</h1>
              <br />
              <h2>
                Please provide URL like :
                <h5>http://localhost:4000/updatenews/topic_num=0&camp_num=0</h5>
              </h2>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  console.log(
    "constext is================================================  ",
    query
  );
  console.log("query => ", query.topic_num, query.camp_num);
  if (query.topic_num !== undefined && query.camp_num !== undefined) {
    const reqBody = { topic_num: 45, camp_num: 1 };
    const res = await editNewsFeedApi(reqBody);

    return {
      props: {
        res,
      },
    };
  } else {
    let res = { data: "error" };
    return {
      props: {
        res,
      },
    };
  }
}
