import Edit from "../../components/ComponentPages/News/Edit";
import Layout from "../../hoc/layout";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import { getCampEditNewsDataApi } from "../../network/api/campNewsApi";

import useAuthentication from "../../../src/hooks/isUserAuthenticated";
import { setCampNewsToEdit } from "src/store/slices/news";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function EditNewsPage({ news }) {
  const router = useRouter();
  const isLogin = useAuthentication();
  const dispatch = useDispatch();
  dispatch(setCampNewsToEdit(news));
  console.log("news in edit", news);
  useEffect(() => {
    if (isLogin === true) {
      router.replace("/login");
    } else if (news === {} && isLogin === false) {
      router.replace(`/topic/${router.query.camp[0]}/${router.query.camp[0]}`);
    }
  }, []);

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
  // const reqBody = {
  //   topic_num: +query?.camp[0]?.split("-")[0],
  //   camp_num: +query?.camp[1]?.split("-")[0],
  // };
  const reqBody = { newsfeed_id: +query?.camp[2]?.split("-")[0] };

  const res = await getCampEditNewsDataApi(reqBody);
  const news = (res && res[0]) || {};
  return {
    props: {
      news,
    },
  };
}
