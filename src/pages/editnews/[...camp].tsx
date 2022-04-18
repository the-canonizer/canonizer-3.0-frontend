import Edit from "../../components/ComponentPages/News/Edit";
import Layout from "../../hoc/layout";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import { getCampNewsDataApi } from "../../network/api/campNewsApi";

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
  useEffect(() => {
    if (isLogin === true) {
      router.replace("/login");
    } else if (news.length === 0 && isLogin === false) {
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
  const reqBody = {
    topic_num: +query?.camp[0]?.split("-")[0],
    camp_num: +query?.camp[1]?.split("-")[0],
  };
  const id = +query?.camp[2]?.split("-")[0];

  const response = await getCampNewsDataApi(reqBody);
  let res = {};
  response?.forEach((resp) => {
    if (resp.id === id) {
      res = resp;
    }
  });
  const news = res || {};
  return {
    props: {
      news,
    },
  };
}
