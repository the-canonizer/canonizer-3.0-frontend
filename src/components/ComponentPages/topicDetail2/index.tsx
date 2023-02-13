import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
import CustomSkelton from "../../common/customSkelton";
import TimelineSlider from "./timelineSlider";

//  "../../../store/slices/filtersSlice";
import {
  getCanonizedCampStatementApi,
  getNewsFeedApi,
  getTreesApi,
  getCanonizedCampSupportingTreeApi,
  getCurrentTopicRecordApi,
  getCurrentCampRecordApi,
} from "src/network/api/campDetailApi";
import { fallBackSrc } from "src/assets/data-images";
import { RootState } from "src/store";
import SideBar from "../Home/SideBar";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import styles from "./topicDetails.module.scss";
import CampTreeCard from "../TopicDetails/CampTreeCard";
import { BackTop, Image, Typography, message, Alert } from "antd";

import { setCurrentTopic } from "../../../store/slices/topicSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import moment from "moment";
import {
  GetActiveSupportTopic,
  GetCheckSupportExists,
} from "src/network/api/topicAPI";
import queryParams from "src/utils/queryParams";
import isAuth from "../../../hooks/isUserAuthenticated";
import {
  setCampSupportingTree,
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
} from "src/store/slices/campDetailSlice";

import { getHistoryApi } from "../../../network/api/history";

const { Link } = Typography;

import { replaceSpecialCharacters } from "src/utils/generalUtility";
import TimeLine from "../TimeLine";

const TopicDetails = () => {
  let myRefToCampStatement = useRef(null);
  const { isUserAuthenticated } = isAuth();
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);
  const [getCheckSupportStatus, setGetCheckSupportStatus] = useState({});
  const [topicList, setTopicList] = useState([]);
  const [totalCampScoreForSupportTree, setTotalCampScoreForSupportTree] =
    useState<number>(null);

  const [supportTreeForCamp, setSupportTreeForCamp] = useState<number>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    asof,
    asofdate,
    algorithm,
    newsFeed,
    topicRecord,
    campRecord,
    tree,
    campExist,
    viewThisVersionCheck,
  } = useSelector((state: RootState) => ({
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    newsFeed: state?.topicDetails?.newsFeed,
    asof: state?.filters?.filterObject?.asof,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
  }));

  const reqBody = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
    as_of: asof,
    as_of_date:
      asof == "default" || asof == "review"
        ? Date.now() / 1000
        : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
  };
  useEffect(() => {
    async function getTreeApiCall() {
      setGetTreeLoadingIndicator(true);
      setLoadingIndicator(true);
      const reqBodyForService = {
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
        asOf: asof,
        asofdate:
          asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
        algorithm: algorithm,
        update_all: 1,
        fetch_topic_history: viewThisVersionCheck ? 1 : null,
      };

      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
        as_of: asof,
        as_of_date:
          asof == "default" || asof == "review"
            ? Date.now() / 1000
            : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
      };
      const topicNum = router?.query?.camp?.at(0)?.split("-")?.at(0);

      const body = { topic_num: topicNum };
      const reqBodyForCampData = {
        topic_num: +router?.query?.camp[0]?.split("-")[0],
        camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
        type: "all",
        per_page: 4,
        page: 1,
      };
      await Promise.all([
        getNewsFeedApi(reqBody),
        getCurrentTopicRecordApi(reqBody),
        getCurrentCampRecordApi(reqBody),
        getCanonizedCampStatementApi(reqBody),
        dispatch(setCampSupportingTree({})),
        getHistoryApi(reqBodyForCampData, "1", "statement"),
        getCanonizedAlgorithmsApi(),
        getTreesApi(reqBodyForService),
      ]);
      //getCanonizedCampSupportingTreeApi(reqBody, algorithm);
      const reponse = await GetActiveSupportTopic(topicNum && body);
      if (reponse?.status_code == 200) {
        setTopicList(reponse?.data);
      }
      setGetTreeLoadingIndicator(false);
      setLoadingIndicator(false);
    }
    getTreeApiCall();
  }, [asofdate, algorithm, +(router?.query?.camp[1]?.split("-")[0] ?? 1)]);

  const reqBodyData = {
    topic_num: +router?.query?.camp[0]?.split("-")[0],
    camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
  };

  const GetCheckStatusData = async () => {
    let response = await GetCheckSupportExists(queryParams(reqBodyData));
    if (response && response.status_code === 200) {
      setGetCheckSupportStatus(response.data);
      //dispatch remove
      dispatch(setCurrentCheckSupportStatus(""));
      dispatch(setCheckSupportExistsData(""));
      //dispatch add Values data
      dispatch(
        setCurrentCheckSupportStatus(
          response.data.warning ? response.data.warning : ""
        )
      );
      dispatch(setCheckSupportExistsData(response.data));
      // dispatch(setManageSupportStatusCheck(true));
    }
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      GetCheckStatusData();
    }
    // fetchTotalScore();
  }, [isUserAuthenticated, router, algorithm]);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };

  const setCurrentTopics = (data) => dispatch(setCurrentTopic(data));

  const onCreateCamp = () => {
    // const queryParams = router.query;

    const data = {
      message: null,
      topic_num: topicRecord?.topic_num,
      topic_name: topicRecord?.topic_name,
      camp_name: topicRecord?.camp_name,
      parent_camp_num: topicRecord?.camp_num,
    };

    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");

    router.push({
      pathname: `/camp/create/${
        topicRecord?.topic_num
      }-${replaceSpecialCharacters(topicName, "-")}/${
        campRecord?.camp_num
      }-${replaceSpecialCharacters(campName, "-")}`,
    });

    setCurrentTopics(data);
  };

  return (
    <>
      <div className={styles.topicDetailContentWrap}>
        {(tree && tree["1"]?.is_valid_as_of_time) || asof == "default" ? (
          <CampInfoBar
            isTopicPage={true}
            payload={{
              topic_num: +router?.query?.camp[0]?.split("-")[0],
              camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
            }}
            getCheckSupportStatus={getCheckSupportStatus}
          />
        ) : (
          <CampInfoBar
            payload={{
              topic_num: +router?.query?.camp[0]?.split("-")[0],
              camp_num: +(router?.query?.camp[1]?.split("-")[0] ?? 1),
            }}
            isTopicHistoryPage={true}
            getCheckSupportStatus={getCheckSupportStatus}
          />
        )}

        <aside className={styles.miniSide + " leftSideBar miniSideBar"}>
          <SideBar onCreateCamp={onCreateCamp} />
        </aside>

        <>
          <div className={styles.pageContent + " pageContentWrap"}>
            <TimelineSlider />
            <TimeLine/>
            {/* <CampTreeCard
              getTreeLoadingIndicator={getTreeLoadingIndicator}
              scrollToCampStatement={scrollToCampStatement}
              setTotalCampScoreForSupportTree={setTotalCampScoreForSupportTree}
              setSupportTreeForCamp={setSupportTreeForCamp}
            /> */}

            {/* {((tree && tree["1"]?.is_valid_as_of_time) ||
              asof == "default") && (
              <>
                {campExist &&
                  !campExist?.camp_exist &&
                  (loadingIndicator ? (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={1}
                      stylingClass=""
                      isButton={false}
                    />
                  ) : (
                    <>
                      <Alert
                        className="alert-camp-created-on"
                        message="The camp was first created on"
                        type="info"
                        description={
                          <span>
                            <Link
                              onClick={() => {
                                onCreateCampDate();
                              }}
                            >
                              {" "}
                              {new Date(
                                (campExist && campExist?.created_at) * 1000
                              ).toLocaleString()}
                            </Link>
                          </span>
                        }
                      />
                    </>
                  ))}
              </>
            )} */}
          </div>
        </>
      </div>
      <BackTop />
    </>
  );
};

export default TopicDetails;
