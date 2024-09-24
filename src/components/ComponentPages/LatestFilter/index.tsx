import { CloseOutlined } from "@ant-design/icons";
import { Space, Tag } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/store";
import {
  setFilterCanonizedTopics,
  setSelectAlgoBrowsePage,
  setViewThisVersion,
} from "src/store/slices/filtersSlice";
import {
  setScoreCheckBox,
  setArchivedCheckBox,
} from "src/store/slices/utilsSlice";
import { useRouter } from "next/router";
import styles from "./latestFilter.module.scss";
import { getTreesApi } from "src/network/api/campDetailApi";
import { useEffect } from "react";
import Image from "next/image";
import calendarIcon from "../../../../public/images/calendar-icon.svg";
import { setAsOfValues } from "src/store/slices/campDetailSlice";

const LatestFilter = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    algorithms,
    selectedAlgorithm,
    is_camp_archive_checked,
    is_checked,
    filteredAsOfDate,
    includeReview,
    filteredScore,
    filterObject,
    viewThisVersion,
    campScoreValue,
    selectedAsOf,
    asof,
    algorithm,
    viewThisVersionCheck,
    asofdate,
    selectAlgoBrowsePage,
  } = useSelector((state: RootState) => ({
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    loading: state?.loading?.loading,
    is_checked: state?.utils?.score_checkbox,
    filteredAsOfDate: state?.filters?.filterObject?.asofdate,
    includeReview: state?.filters?.filterObject?.includeReview,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    algorithms: state.homePage?.algorithms,
    current_date_filter: state?.filters?.current_date,
    filterObject: state?.filters?.filterObject,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    campScoreValue: state?.filters?.campWithScoreValue,
    selectedAsOf: state?.filters?.filterObject?.asof,
    asof: state?.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    asofdate: state.filters?.filterObject?.asofdate,
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
    selectAlgoBrowsePage: state?.filters?.selectAlgoBrowsePage,
  }));
  const lable = algorithms?.find((obj) => {
    return obj.algorithm_key == selectedAlgorithm;
  });
  const onChangeRoute = (
    filterByScore = filterObject?.filterByScore,
    algorithm = filterObject?.algorithm,
    asof = filterObject?.asof,
    asofdate = filterObject?.asofdate,
    namespace_id = filterObject?.namespace_id,
    viewversion = viewThisVersion
  ) => {
    let query: any = {
      score: filterByScore,
      algo: algorithm,
      canon: namespace_id,
      asof: asof,
      filter: campScoreValue || "10",
    };

    if (asof === "bydate") {
      query.asofdate = asofdate;
    }

    if (viewversion) {
      query.viewversion = "1";
    }
    if (router) {
      router.query = { ...router?.query, ...query };
    }

    if (asof !== "bydate") {
      delete router?.query.asofdate;
    }

    if (String(filterByScore) === "0") {
      delete router?.query.score;
    }

    if (String(namespace_id) === "1") {
      delete router?.query.canon;
    }

    if (!namespace_id && String(namespace_id) === "0") {
      delete router.query.canon;
    }

    if (asof === "default") {
      delete router?.query.asof;
    }

    if (!query?.canon) {
      delete router?.query.canon;
    }

    if (algorithm === "blind_popularity") {
      delete router?.query.algo;
    }

    if (String(campScoreValue) === "10") {
      delete router?.query.filter;
    }

    if (
      router?.query.filter === "undefined" ||
      router?.query.filter === undefined ||
      router?.query.filter === "null" ||
      router?.query.filter === null
    ) {
      delete router?.query.filter;
    }

    router?.replace(router, null, { shallow: true });
  };

  const filterForAsofDate = () => {
    dispatch(setViewThisVersion(false));
    dispatch(
      setFilterCanonizedTopics({
        asof: "default",
      })
    );
    dispatch(setAsOfValues(2));
    onChangeRoute(
      filterObject?.filterByScore,
      filterObject?.algorithm,
      "default",
      Date.now() / 1000,
      filterObject?.namespace_id,
      viewThisVersion
    );
  };
  const filterscore = () => {
    dispatch(setViewThisVersion(false));
    dispatch(
      setFilterCanonizedTopics({
        filterByScore: 0,
      })
    );
    onChangeRoute(
      0,
      filterObject?.algorithm,
      filterObject?.asof,
      filterObject?.asofdate,
      filterObject?.namespace_id,
      viewThisVersion
    );
  };
  const algoRevert = () => {
    onChangeRoute(
      filterObject?.filterByScore,
      "blind_popularity",
      filterObject?.asof,
      filterObject?.asofdate,
      filterObject?.namespace_id,
      viewThisVersion
    );
    dispatch(setFilterCanonizedTopics({ algorithm: "blind_popularity" }));
  };
  const reqBodyForService = {
    topic_num: router?.query?.camp[0]?.split("-")[0],
    camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    asOf: asof,
    asofdate:
      asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
    algorithm: "blind_popularity",
    update_all: 1,
    fetch_topic_history: viewThisVersionCheck ? 1 : null,
  };
  const revertScore = () => {
    getTreesApi(reqBodyForService);
  };
  const reqBody = {
    topic_num: router?.query?.camp[0]?.split("-")[0],
    camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    asOf: asof,
    asofdate:
      asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
    algorithm: algorithm,
    update_all: 1,
    fetch_topic_history: viewThisVersionCheck ? 1 : null,
  };
  const revertScoreAndAlgo = () => {
    getTreesApi(reqBody);
  };

  useEffect(() => {
    revertScoreAndAlgo();
  }, [selectAlgoBrowsePage]);
  const clearAllFilter = async () => {
    dispatch(setSelectAlgoBrowsePage(false));
    dispatch(setArchivedCheckBox(false));
    dispatch(setScoreCheckBox(false));
    dispatch(
      setFilterCanonizedTopics({
        filterByScore: 0,
      })
    );
    dispatch(setFilterCanonizedTopics({ algorithm: "blind_popularity" }));
    dispatch(setArchivedCheckBox(false));
    dispatch(setArchivedCheckBox(false));
    filterForAsofDate();
    if (router?.query?.algo && selectedAlgorithm) {
      algoRevert();
    }
    revertScore();
  };
  let filteredDate = moment(filteredAsOfDate * 1000).format("YYYY-MM-DD");
  return (
    // <div className={styles.selected_filter_area}>
    <div className="flex">
      {/* {(router?.query?.algo &&
        selectedAlgorithm &&
        lable?.algorithm_label !== undefined) ||
      is_camp_archive_checked ||
      is_checked ||
      selectedAsOf == "bydate" ||
      includeReview ||
      router?.query?.asof == "review" ||
      filteredScore != 0 ? (
        <span className="flex">
          <label
            className={styles.selected_filter_heading}
            data-testid="Selected filter"
          >
            Selected filter
          </label>
          <span
            className={styles.clear_all_filter}
            onClick={clearAllFilter}
            data-testid="clear_all"
          >
            (Clear All)
          </span>
        </span>
      ) : (
        ""
      )} */}

      <Space size={[0, 18]} wrap className="flex !gap-2.5">
        {router?.query?.algo &&
        selectedAlgorithm &&
        lable?.algorithm_label !== undefined ? (
          <Tag className="bg-canLightGrey rounded-full h-8 px-3.5 !m-0 text-xs text-canBlue leading-4 font-medium border-none flex items-center gap-2.5">
            {/* <CloseOutlined /> */}
            {lable?.algorithm_label}
            <div
              onClick={() => {
                algoRevert();
                revertScore();
              }}
            >
              <Image
                className="cursor-pointer"
                src="/images/filter-cross.svg"
                alt=""
                width={10}
                height={10}
              />
            </div>
          </Tag>
        ) : (
          ""
        )}
        {is_camp_archive_checked ? (
          <Tag
            className="bg-canLightGrey rounded-full h-8 px-3.5 text-xs text-canBlue leading-4 font-medium border-none flex items-center gap-3"
            data-testid="archived_camps"
          >
            Show archived camps
            {/* <CloseOutlined
              onClick={() => {
                dispatch(setArchivedCheckBox(false));
              }}
              data-testid="close_icon_archived_camps"
            /> */}
            <div
              onClick={() => {
                dispatch(setArchivedCheckBox(false));
              }}
              data-testid="close_icon_archived_camps"
            >
              <Image
                className="cursor-pointer"
                src="/images/filter-cross.svg"
                alt=""
                width={10}
                height={10}
              />
            </div>
          </Tag>
        ) : (
          ""
        )}
        {is_checked ? (
          <Tag className="bg-canLightGrey rounded-full h-8 px-3.5 text-xs text-canBlue leading-4 font-medium border-none flex items-center gap-3">
            100% of canonized score
            {/* <CloseOutlined
              onClick={() => {
                dispatch(setScoreCheckBox(false));
              }}
              data-testid="close_icon_100%_of_canonized_score"
            /> */}
            <div
              onClick={() => {
                dispatch(setScoreCheckBox(false));
              }}
              data-testid="close_icon_100%_of_canonized_score"
            >
              <Image
                className="cursor-pointer"
                src="/images/filter-cross.svg"
                alt=""
                width={10}
                height={10}
              />
            </div>
          </Tag>
        ) : (
          ""
        )}
        {selectedAsOf == "bydate" ? (
          <Tag
            className="bg-canLightGrey rounded-full h-8 px-3.5 text-xs text-canBlue leading-4 font-medium border-none flex items-center gap-3"
            data-testid="asOfDate"
          >
            <Image src={calendarIcon} alt="svg" height={20} width={20} />

            {`${filteredDate}`}
            {/* <CloseOutlined
              onClick={filterForAsofDate}
              data-testid="close_icon_as_of_date"
            /> */}
            <div
              onClick={filterForAsofDate}
              data-testid="close_icon_as_of_date"
            >
              <Image
                className="cursor-pointer"
                src="/images/filter-cross.svg"
                alt=""
                width={10}
                height={10}
              />
            </div>
          </Tag>
        ) : (
          ""
        )}
        {includeReview || router?.query?.asof == "review" ? (
          <Tag
            className="bg-canLightGrey rounded-full h-8 px-3.5 text-xs text-canBlue leading-4 font-medium border-none flex items-center gap-3"
            data-testid="include_review"
          >
            {`Include review`}
            {/* <CloseOutlined
              onClick={filterForAsofDate}
              data-testid="close_icon_include_review"
            /> */}
            <div
              onClick={filterForAsofDate}
              data-testid="close_icon_include_review"
            >
              <Image
                className="cursor-pointer"
                src="/images/filter-cross.svg"
                alt=""
                width={10}
                height={10}
              />
            </div>
          </Tag>
        ) : (
          ""
        )}
        {filteredScore != 0 ? (
          <Tag
            className="bg-canLightGrey rounded-full h-8 px-3.5 text-xs text-canBlue leading-4 font-medium border-none flex items-center gap-3"
            data-testid="Score"
          >
            {`Score > ${filteredScore}`}
            {/* <CloseOutlined
              onClick={filterscore}
              data-testid="close_icon_Score"
            /> */}
            <div onClick={filterscore} data-testid="close_icon_Score">
              <Image
                className="cursor-pointer"
                src="/images/filter-cross.svg"
                alt=""
                width={10}
                height={10}
              />
            </div>
          </Tag>
        ) : (
          ""
        )}
      </Space>
    </div>
  );
};

export default LatestFilter;
