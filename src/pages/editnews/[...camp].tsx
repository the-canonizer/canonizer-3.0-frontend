import Edit from "../../components/ComponentPages/News/Edit";
import Layout from "../../hoc/layout";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import { getCampNewsFeedApi } from "../../network/api/addEditNewsApi";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCampNewsToEdit } from "src/store/slices/news";

export default function EditNewsPage({ news }) {
  const dispatch = useDispatch();
  dispatch(setCampNewsToEdit(news));
  return (
    <>
      <Layout>
        <aside className="leftSideBar miniSideBar">
          <SideBarNoFilter />
        </aside>
        <div className="pageContentWrap">
          <Edit />
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;

  const reqBody = {
    topic_num: +query?.camp[0]?.split("-")[0],
    camp_num: +query?.camp[1]?.split("-")[0],
  };
  const res = await getCampNewsFeedApi(reqBody);
  const news = res || [];
  return {
    props: {
      news,
    },
  };
}
