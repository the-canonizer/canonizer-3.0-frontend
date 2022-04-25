import Edit from "../../components/ComponentPages/News/Edit";
import Layout from "../../hoc/layout";
import SideBarNoFilter from "../../components/ComponentPages/Home/SideBarNoFilter";
import { getCampEditNewsDataApi } from "../../network/api/campNewsApi";
import useAuthentication from "../../../src/hooks/isUserAuthenticated";
import { setCampNewsToEdit } from "src/store/slices/news";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "src/store";
import { useSelector } from "react-redux";

export default function EditNewsPage() {
  const router = useRouter();
  const isLogin = useAuthentication();
  const dispatch = useDispatch();
  const tokenBearer = useSelector((state: RootState) => state?.auth?.token);

  useEffect(() => {
    async function getCampEditNewsDataCall() {
      const reqBody = { newsfeed_id: +router.query?.camp[2]?.split("-")[0] };
      const res = await getCampEditNewsDataApi(reqBody, tokenBearer);
      const news = (res && res[0]) || {};
      dispatch(setCampNewsToEdit(news));
      if (isLogin === false) {
        router.push("/login");
      } else if (news === {} && isLogin === true) {
        router.push(`/topic/${router.query.camp[0]}/${router.query.camp[0]}`);
      }
    }
    getCampEditNewsDataCall();
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
