import React from "react";
import { useDispatch } from "react-redux";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "../../store/slices/campDetailSlice";
import { formatTheDate, parseCookies, replaceSpecialCharacters } from "src/utils/generalUtility";
import { setHistory } from "../../store/slices/campDetailSlice";
import Layout from "src/hoc/layout";

import { getHistoryApi } from "../../network/api/history";

import TopicDetails from "src/components/ComponentPages/TopicDetails";
import { setCurrentDate } from "src/store/slices/filtersSlice";
import { useEffect, useRef } from "react";
import DataNotFound from "@/components/ComponentPages/DataNotFound/dataNotFound";
import { createToken } from "src/network/api/userApi";
import { argon2id } from "hash-wasm";
import { useRouter } from "next/router";


const TopicDetailsPage = ({
  current_date,
  newsFeed,
  topicRecord,
  campRecord,
  campStatement,
  statementHistory,
  tree,
  serverCall,
}: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const serverSideCall = useRef(serverCall || false);


  useEffect(() => {
    // let query = {
    //   camp: [
    //     `${topicRecord?.topic_num}-${replaceSpecialCharacters(
    //       topicRecord?.topic_name,
    //       "-"
    //     )}`,
    //     `${
    //       campRecord?.campData?.camp_num
    //         ? `${campRecord?.campData?.camp_num}-${replaceSpecialCharacters(
    //             campRecord?.campData?.camp_name,
    //             "-"
    //           )}`
    //         : "1-Agreement"
    //     }`,
    //   ],
    // };
    // router.query = { ...router?.query, ...query };
    // router.replace(router, null, { shallow: true });
    dispatch(setNewsFeed(newsFeed));
    dispatch(setCurrentTopicRecord(topicRecord));
    dispatch(setCurrentCampRecord(campRecord?.campData));
    dispatch(setCampStatement(campStatement));
    dispatch(setHistory(statementHistory));
    dispatch(setTree(tree?.status_code == 200 ? [tree?.treeData] : []));
    dispatch(setCurrentDate(current_date));
  }, []);

  let ErrorStatus =
    tree?.status_code == 404 ||
    (tree?.status_code == 422 &&
      (!tree?.error?.camp_num ||
        (tree?.error?.camp_num && tree?.error?.topic_num)))
      ? "Topic"
      : "Camp";

  return (
    <Layout>
      {tree?.status_code == 404 ||
      campRecord?.status_code == 404 ||
      campRecord?.status_code == 400 ? (
        <DataNotFound
          name={ErrorStatus}
          message={`${ErrorStatus} not found`}
          backURL={"/"}
          goBack={true}
        />
      ) : (
        <TopicDetails serverSideCall={serverSideCall} />
      )}
    </Layout>
  );
};

function buildSearchQuery(query) {
  let queryStr: any = {};

  if (query?.algo) {
    queryStr.algo = query.algo;
  }
  if (query?.asof) {
    queryStr.asof = query.asof;
  }
  if (query?.asofdate && query?.asof === "bydate") {
    queryStr.asof = query.asof;
    queryStr.asofdate = query.asofdate;
  }
  if (query?.viewversion) {
    queryStr.viewversion = query.viewversion;
  }
  if (query?.is_tree_open) {
    queryStr.is_tree_open = query.is_tree_open;
  }

  const searchParams = new URLSearchParams(queryStr);
  return searchParams.toString();
}

export async function getServerSideProps({ req, query, res }) {
  let topicNum = query?.camp[0]?.split("-")[0];
  let campNum = query?.camp[1]?.split("-")[0] || 1;
  let topicName = query?.camp[0];
  let campName = query?.camp[1];
  let token = null;

  let hashValue
  let cookies
  const cookieKey = topicNum + '.' + campNum;
  async function generateHashValue() {
    const salt = Buffer.from("kjshfjhfkkfuriuYHYUHUHUYUyyihuHUY");
    const asOfData =
        query?.asofdate && query?.asof == "bydate"
            ? parseFloat(query?.asofdate)
            : Date.now() / 1000;

    const data = Math.ceil(asOfData)

    const hash = await argon2id({
        password: data.toString(),
        salt,
        parallelism: parseInt(process.env.NEXT_PUBLIC_PARALLELISM),
        iterations: parseInt(process.env.NEXT_PUBLIC_ITERATIONS),
        memorySize: parseInt(process.env.NEXT_PUBLIC_MEMORYSIZE),
        hashLength: parseInt(process.env.NEXT_PUBLIC_HASHLENGTH),
        outputType: "encoded"
    });

    const parts = hash.split('$');
    hashValue = "$" + parts[parts.length - 2] + "$" + parts[parts.length - 1];

    let cookiesString = req.headers.cookie || '';
     cookies = parseCookies(cookiesString); // Parse cookies into an object

      if(!cookies[cookieKey] || !(cookieKey in cookies) ) {
        const expirationInSeconds = parseInt(process.env.NEXT_PUBLIC_EXPIRATIONDATE);
        const expirationDate = new Date(Date.now() + expirationInSeconds * 1000);
        const expires = expirationDate.toUTCString();
        const cookieValue = `${hashValue}; expires=${expires}; path=/`;
        res.setHeader('Set-Cookie', cookieKey + '=' + cookieValue);
    }
}



  await generateHashValue();


  const currentDate = new Date().valueOf();
  const reqBodyForService = {
    topic_num: topicNum,
    camp_num: campNum,
    asOf: query?.asof ?? "default",
    asofdate:Math.ceil(
      query?.asofdate && query?.asof == "bydate"
        ? parseFloat(query?.asofdate)
        : Date.now() / 1000),
    algorithm: query?.algo || "blind_popularity",
    update_all: 1,
    fetch_topic_history: query?.viewversion == "1" ? 1 : null,
    view: req.cookies[cookieKey] ? req.cookies[cookieKey] : hashValue
  };

  const reqBody = {
    topic_num: topicNum,
    camp_num: campNum,
    as_of: query?.asof ?? "default",
    as_of_date:
      query?.asofdate && query?.asof == "bydate"
        ? formatTheDate(query?.asofdate * 1000, "DD-MM-YYYY H:mm:ss")
        : Date.now() / 1000,
  };

  const reqBodyForCampData = {
    topic_num: topicNum,
    camp_num: campNum,
    type: "all",
    per_page: 4,
    page: 1,
  };

  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const [
    newsFeed,
    topicRecord,
    campRecord,
    campStatement,
    statementHistory,
    tree,
  ] = await Promise.all([
    getNewsFeedApi(reqBody, token),
    getCurrentTopicRecordApi(reqBody, token),
    getCurrentCampRecordApi(reqBody, token),
    getCanonizedCampStatementApi(reqBody, token),
    getHistoryApi(reqBodyForCampData, "1", "statement", token),
    getTreesApi(reqBodyForService),
  ]);

  const resTopicName = topicRecord?.topic_name?.replaceAll(" ", "-");
  const resCampName = campRecord?.campData?.camp_name?.replaceAll(" ", "-");

  const currentUrl = "/topic/" + topicName + "/" + campName;
  let resUrl = `/topic/${topicRecord?.topic_num}-${replaceSpecialCharacters(
    resTopicName,
    "-"
  )}/${campRecord?.campData?.camp_num}-${replaceSpecialCharacters(
    resCampName,
    "-"
  )}`;

  if (currentUrl !== resUrl) {
    let queryStr: any = buildSearchQuery(query);

    return {
      redirect: {
        permanent: false,
        destination: `${resUrl}${queryStr ? "?" + queryStr : ""}`,
      },
      props: {
        current_date: currentDate,
        newsFeed: newsFeed || [],
        topicRecord: topicRecord || {},
        campRecord: campRecord || {},
        campStatement: campStatement || [],
        statementHistory: statementHistory?.data || {},
        tree: tree || [],
        serverCall: true,
      },
    };
  }

  return {
    props: {
      current_date: currentDate,
      newsFeed: newsFeed || [],
      topicRecord: topicRecord || {},
      campRecord: campRecord || {},
      campStatement: campStatement || [],
      statementHistory: statementHistory?.data || {},
      tree: tree || [],
      serverCall: true,
    },
  };
}

TopicDetailsPage.displayName = "TopicDetailsPage";

export default TopicDetailsPage;
