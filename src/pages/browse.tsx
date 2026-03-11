import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Input, Select, Radio, DatePicker, Switch, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";
import { useCookies } from "react-cookie";

import Layout from "../hoc/layout";
import FullScoreCheckbox from "../components/ComponentPages/FullScoreCheckbox";
import ArchivedCampCheckBox from "../components/ComponentPages/ArchivedCampCheckBox";
import CustomSkelton from "../components/common/customSkelton";
import { RootState } from "src/store";
import {
  setCurrentDate,
  setOnlyMyTopic,
  setFilterCanonizedTopics,
  setIsReviewCanonizedTopics,
  setSelectAlgoBrowsePage,
} from "src/store/slices/filtersSlice";
import { setViewThisVersion } from "src/store/slices/filtersSlice";
import {
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
  setManageSupportStatusCheck,
} from "src/store/slices/campDetailSlice";
import {
  setScoreViewTopic,
  setSortLatestTopic,
} from "src/store/slices/utilsSlice";
import { setShowDrawer } from "src/store/slices/filtersSlice";
import {
  getCanonizedNameSpacesApi,
  getCanonizedTopicsApi,
  getCanonizedAlgorithmsApi,
  getCanonizedTopicsForSuggestion,
} from "src/network/api/homePageApi";
import {
  replaceSpecialCharacters,
  changeSlashToArrow,
} from "src/utils/generalUtility";
import useAuthentication from "src/hooks/isUserAuthenticated";
import styles from "./browse.module.scss";

const { Search } = Input;
const { Option } = Select;
const antIcon = <LoadingOutlined spin />;

const BrowsePage = ({ current_date }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isUserAuthenticated } = useAuthentication();
  // eslint-disable-next-line no-unused-vars
  const [, setCookie] = useCookies(["canAlgo", "asof", "asofDate"]);

  dispatch(setCurrentDate(current_date));

  // ── Redux state ──
  const {
    canonizedTopics,
    asofdate,
    asof,
    algorithm,
    filterByScore,
    nameSpaces,
    filterNameSpace,
    userEmail,
    filterNameSpaceId,
    search,
    is_checked,
    onlyMyTopicsCheck,
    loading,
    algorithms,
    viewThisVersion,
    current_date_filter,
    campScoreValue,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    nameSpaces: state.homePage?.nameSpaces,
    filterNameSpace: state?.filters?.filterObject?.nameSpace,
    userEmail: state?.auth?.loggedInUser?.email,
    filterNameSpaceId: String(state?.filters?.filterObject?.namespace_id),
    search: state?.filters?.filterObject?.search,
    is_checked: state?.utils?.score_checkbox,
    onlyMyTopicsCheck: state?.filters?.onlyMyTopicsCheck,
    loading: state?.loading?.loading,
    algorithms: state.homePage?.algorithms,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    current_date_filter: state?.filters?.current_date,
    campScoreValue: state?.filters?.campWithScoreValue,
  }));
  const { is_camp_archive_checked } = useSelector((state: RootState) => ({
    is_camp_archive_checked: state?.utils?.archived_checkbox,
  }));
  const { sortLatestTopic, sortScoreViewTopic } = useSelector(
    (state: RootState) => ({
      sortLatestTopic: state?.utils?.sortLatestTopic,
      sortScoreViewTopic: state?.utils?.sortScoreViewTopic,
    })
  );

  // ── Local state ──
  // eslint-disable-next-line no-unused-vars
  const [_pageNumber, setPageNumber] = useState(1);
  const pageNumberRef = useRef(1);
  const [topicsData, setTopicsData] = useState(canonizedTopics);
  const [nameSpacesList, setNameSpacesList] = useState(nameSpaces);
  const [isReview, setIsReview] = useState(asof == "review");
  const [inputSearch, setInputSearch] = useState(search || "");
  const [nameSpaceId, setNameSpaceId] = useState(String(filterNameSpaceId) || "1");
  const [loadMoreIndicator, setLoadMoreIndicator] = useState(false);
  const [getTopicsLoadingIndicator, setGetTopicsLoadingIndicator] = useState(false);
  const [selectedNameSpace, setSelectedNameSpace] = useState(filterNameSpace);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedResult, setSearchedResult] = useState([]);
  const [allowClear, setAllowClear] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [asOfValue, setAsOfValue] = useState(
    asof == "default" ? 2 : asof == "review" ? 1 : 3
  );
  const [inputScoreValue, setInputScoreValue] = useState(filterByScore);
  const [filterTimer, setFilterTimer] = useState(null);

  const inputRef = useRef(null);
  const didMount = useRef(false);

  // ── Route & URL sync ──
  function removeEmptyValues(obj: any) {
    const result: any = {};
    for (const key in obj) {
      const value = obj[key];
      if (value && value != "undefined") result[key] = value;
    }
    return result;
  }

  const onChangeRoute = (
    fScore = filterByScore,
    algo = algorithm,
    asofVal = asof,
    asofD = asofdate,
    nsId = filterNameSpaceId,
    viewversion = viewThisVersion
  ) => {
    let query: any = {
      score: fScore,
      algo: algo,
      canon: nsId,
      asof: asofVal,
      filter: campScoreValue || "10",
    };
    if (asofVal == "bydate") query.asofdate = asofD;
    if (viewversion) query.viewversion = "1";
    router.query = { ...router?.query, ...query };
    if (asofVal != "bydate") delete router.query.asofdate;
    if (String(fScore) === "0") delete router.query.score;
    if (String(nsId) === "1" || !nsId || String(nsId) === "0") delete router.query.canon;
    if (asofVal === "default") delete router.query.asof;
    if (!query?.canon) delete router.query.canon;
    if (algo === "blind_popularity") delete router.query.algo;
    if (String(campScoreValue) === "10") delete router.query.filter;
    if (["undefined", undefined, "null", null].includes(router.query.filter as any))
      delete router.query.filter;
    router.replace(router, null, { shallow: true });
  };

  // ── Namespace select ──
  const selectNameSpace = (id: any, nameSpace?: any) => {
    setNameSpaceId(String(id));
    const label = nameSpace?.children || nameSpace;
    setSelectedNameSpace(label);
    if (id?.toString() !== "1") {
      router.query.canon = id;
      delete router?.query?.namespace;
      router?.replace(router, undefined, { shallow: true });
    } else {
      const params = router?.query;
      delete params.canon;
      delete params.namespace;
      router.query = params;
      router.replace(router, undefined, { shallow: true });
    }
    dispatch(setFilterCanonizedTopics({ namespace_id: String(id), nameSpace: label }));
  };

  // ── API call ──
  async function getTopicsApiCallWithReqBody(loadMore = false) {
    if (loadMore) {
      pageNumberRef.current = pageNumberRef.current + 1;
      setPageNumber(pageNumberRef.current);
    } else {
      pageNumberRef.current = 1;
      setPageNumber(1);
    }
    const reqBody = {
      algorithm,
      asofdate: asof == ("default" || asof == "review") ? Date.now() / 1000 : asofdate,
      namespace_id: String(nameSpaceId),
      page_number: pageNumberRef.current,
      page_size: 15,
      search: inputSearch,
      filter: filterByScore,
      asof,
      user_email: onlyMyTopicsCheck ? userEmail : "",
      is_archive: is_camp_archive_checked ? 1 : 0,
      sort: sortLatestTopic ? true : false,
    };
    await getCanonizedTopicsApi(reqBody, loadMore);
    setLoadMoreIndicator(false);
  }

  // ── Search ──
  const onSearch = (value: string) => {
    setInputSearch(value.trim());
    dispatch(setFilterCanonizedTopics({ search: value || "" }));
    setShowSearchDropdown(false);
  };

  const handleKeyUpSearch = (event: any) => {
    setSearchedResult([]);
    setSearchLoading(true);
    const value = event.target.value?.trim();
    if (value) {
      setAllowClear(true);
      setSearchTerm(value);
      setShowSearchDropdown(true);
    } else {
      setAllowClear(false);
      setSearchTerm("");
      setSearchedResult([]);
      setShowSearchDropdown(false);
    }
  };

  const onSearchInput = async (value: string) => {
    try {
      const reqBody = {
        algorithm,
        asofdate: asof == ("default" || asof == "review") ? Date.now() / 1000 : asofdate,
        namespace_id: String(nameSpaceId),
        page_number: pageNumberRef.current,
        page_size: 15,
        search: value,
        filter: filterByScore,
        asof,
        user_email: onlyMyTopicsCheck ? userEmail : "",
        is_archive: is_camp_archive_checked ? 1 : 0,
      };
      const res = await getCanonizedTopicsForSuggestion(reqBody);
      setSearchLoading(false);
      if (res) {
        setSearchedResult(res?.topic);
        setTimeout(() => inputRef?.current?.focus(), 400);
      }
    } catch {
      /* */
    }
  };

  const handleTopicNameClick = (value: string, e: any) => {
    e.preventDefault();
    if (value?.trim()) {
      setInputSearch(value.trim());
      setShowSearchDropdown(false);
    }
  };

  // ── Sort ──
  const onLatestTopic = () => {
    dispatch(setSortLatestTopic(true));
    dispatch(setScoreViewTopic(false));
  };
  const onScoreViewTopic = () => {
    dispatch(setScoreViewTopic(true));
    dispatch(setSortLatestTopic(false));
  };

  // ── Algorithm ──
  const selectAlgorithm = (value: string) => {
    setCookie("canAlgo", value, { path: "/" });
    dispatch(setFilterCanonizedTopics({ algorithm: value }));
    dispatch(setSelectAlgoBrowsePage(true));
    onChangeRoute(filterByScore, value);
  };

  // ── Score filter ──
  const filterOnScore = (e: any) => {
    const { value } = e.target;
    setInputScoreValue(value);
    clearTimeout(filterTimer);
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      const newTimer = setTimeout(() => {
        dispatch(setFilterCanonizedTopics({ filterByScore: value }));
        onChangeRoute(value);
      }, 1000);
      setFilterTimer(newTimer);
    }
  };

  // ── As Of ──
  function momentDateObject(e: any) { return e?._d; }

  const pickDate = (e: any) => {
    dispatch(setViewThisVersion(false));
    let IsoDateFormat: number;
    if (e == null) {
      IsoDateFormat = Date.now() / 1000;
    } else {
      let datepicker =
        moment().unix() > moment(e?._d).unix() &&
        moment().format("YYYY-MM-DD") > moment(e?._d).format("YYYY-MM-DD")
          ? momentDateObject(moment(e?._d).endOf("day"))
          : momentDateObject(moment(e?._d).set({ hour: moment().hour(), minute: moment().minute(), second: moment().second() }));
      setDatePickerValue(datepicker);
      IsoDateFormat = Date.parse(datepicker) / 1000;
    }
    setCookie("asofDate", JSON.stringify(IsoDateFormat), { path: "/" });
    setCookie("asof", "bydate", { path: "/" });
    dispatch(setFilterCanonizedTopics({ asofdate: IsoDateFormat, asof: "bydate" }));
    onChangeRoute(filterByScore, algorithm, "bydate", IsoDateFormat);
  };

  const handleAsOfClick = () => {
    if (datePickerValue !== null) {
      let dateValue =
        moment().unix() > moment(datePickerValue).unix() &&
        moment().format("YYYY-MM-DD") > moment(datePickerValue).format("YYYY-MM-DD")
          ? momentDateObject(moment(datePickerValue).endOf("day"))
          : momentDateObject(moment(datePickerValue).set({ hour: moment().hour(), minute: moment().minute(), second: moment().second() }));
      setCookie("asofDate", JSON.stringify(Date.parse(dateValue) / 1000), { path: "/" });
      setCookie("asof", "bydate", { path: "/" });
      dispatch(setFilterCanonizedTopics({ asofdate: Date.parse(dateValue) / 1000, asof: "bydate" }));
      onChangeRoute(filterByScore, algorithm, "bydate", Date.parse(dateValue) / 1000);
    } else {
      dispatch(setFilterCanonizedTopics({ asofdate: Date.now() / 1000, asof: "bydate" }));
      onChangeRoute(filterByScore, algorithm, "bydate", Date.now() / 1000);
    }
  };

  const onAsOfChange = (e: any) => {
    if (e.target.value === 3) setIsDatePicker(true);
    else setIsDatePicker(false);
    setAsOfValue(e.target.value);
  };

  const handleCheckbox = (checked: boolean) => {
    dispatch(setOnlyMyTopic(checked));
  };

  const handleTopicClick = () => {
    setGetTopicsLoadingIndicator(true);
    dispatch(setShowDrawer(true));
  };

  // ── Effects ──
  useEffect(() => {
    let queries = router?.query;
    if ("namespace" in queries) {
      const { namespace, ...rest } = queries;
      rest.canon = namespace;
      router.query = rest;
      router?.replace(router, null, { shallow: true });
    }
    return () => { dispatch(setOnlyMyTopic(false)); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setCurrentCheckSupportStatus(""));
    dispatch(setCheckSupportExistsData(""));
    dispatch(setManageSupportStatusCheck(false));
    if (!(nameSpaces?.length > 0)) getCanonizedNameSpacesApi();
    if (!(algorithms?.length > 0)) getCanonizedAlgorithmsApi();
    if (String(filterNameSpaceId) !== "1") {
      router.query.canon = String(filterNameSpaceId);
      delete router.query?.namespace;
      router.replace(router, undefined, { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      let aa: any = removeEmptyValues({
        filterByScore: `${router.query.score}` || `${filterByScore}` || "0",
        asofdate: +router.query.asofdate || asofdate,
        asof: router.query.asof || asof || "default",
        algorithm: router.query.algo || algorithm || "blind_popularity",
        namespace_id: +router.query.canon,
      });
      dispatch(setFilterCanonizedTopics(aa));
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filterNameSpaceId) {
      const filteredName = nameSpacesList?.filter((n: any) => n?.id == filterNameSpaceId);
      if (filteredName && filteredName.length) {
        dispatch(setFilterCanonizedTopics({
          nameSpace: filteredName[0]?.label,
          namespace_id: String(filteredName[0]?.id),
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterNameSpaceId, nameSpacesList]);

  useEffect(() => {
    setSelectedNameSpace(filterNameSpace);
    setNameSpaceId(String(filterNameSpaceId));
    setInputSearch(search?.trim() || "");
    setNameSpacesList(nameSpaces);
  }, [filterNameSpace, filterNameSpaceId, search, nameSpaces]);

  useEffect(() => {
    setTopicsData(canonizedTopics);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonizedTopics?.topics]);

  useEffect(() => {
    setIsReview(asof == "review");
    setAsOfValue(asof == "default" ? 2 : asof == "review" ? 1 : 3);
  }, [asof]);

  useEffect(() => {
    async function getTopicsApiCall() {
      setGetTopicsLoadingIndicator(true);
      await getTopicsApiCallWithReqBody();
      setGetTopicsLoadingIndicator(false);
    }
    getTopicsApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asofdate, asof, algorithm, nameSpaceId, filterByScore, inputSearch, is_camp_archive_checked, onlyMyTopicsCheck, sortLatestTopic, sortScoreViewTopic]);

  useEffect(() => {
    if (inputSearch) setAllowClear(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search suggestion throttle
  /* eslint-disable */
  let throttled: NodeJS.Timeout | null = null;
  useEffect(() => {
    if (throttled) clearTimeout(throttled);
    inputRef.current?.focus();
    throttled = setTimeout(() => {
      if (searchTerm?.trim()) onSearchInput(searchTerm);
    }, 800);
    return () => { if (throttled) { clearTimeout(throttled); throttled = null; } };
  }, [searchTerm]);
  /* eslint-enable */

  // Reset sort on homepage
  useEffect(() => {
    if (router.pathname == "/") {
      dispatch(setScoreViewTopic(false));
      dispatch(setSortLatestTopic(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Get namespace label ──
  const getNamespaceLabel = () => {
    if (!nameSpacesList?.length) return "";
    const ns = nameSpacesList.find((n: any) => String(n.id) === nameSpaceId);
    return ns?.label || "";
  };

  // ── Render ──
  const topics = topicsData?.topics || [];

  return (
    <Layout routeName={"browse"}>
      <div className={styles.browsePage}>
        {/* Header */}
        <div className={styles.browseHeader}>
          <h1>Explore Topics</h1>
          <p>Find a question you care about and say where you stand.</p>
        </div>

        {/* Controls bar */}
        <div className={styles.browseControls}>
          <div className={styles.controlsRow}>
            <div className={styles.controlsLeft}>
              {/* Search */}
              <div className={styles.searchInput}>
                <Search
                  key={inputSearch}
                  placeholder="Search topics..."
                  allowClear={allowClear}
                  defaultValue={inputSearch}
                  onSearch={onSearch}
                  onChange={handleKeyUpSearch}
                  ref={inputRef}
                  disabled={loading}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 300)}
                  onFocus={() => { setSearchLoading(false); setShowSearchDropdown(true); }}
                />
                {showSearchDropdown && searchTerm && (
                  <div className={styles.searchDropdown}>
                    <ul>
                      {searchLoading ? (
                        <li className={styles.searchLoader}><LoadingOutlined spin /></li>
                      ) : searchedResult?.length > 0 ? (
                        searchedResult.map((t: any, i: number) => (
                          <li key={i} onClick={handleTopicNameClick.bind(null, t?.topic_name)}>{t?.topic_name}</li>
                        ))
                      ) : searchTerm ? (
                        <li>No results</li>
                      ) : null}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sort toggle */}
              <div className={styles.sortToggle}>
                <button
                  className={`${styles.sortBtn} ${sortLatestTopic ? styles.sortBtnActive : ""}`}
                  onClick={onLatestTopic}
                >
                  Latest
                </button>
                <button
                  className={`${styles.sortBtn} ${sortScoreViewTopic ? styles.sortBtnActive : ""}`}
                  onClick={onScoreViewTopic}
                >
                  Top Scored
                </button>
              </div>
            </div>

            <div className={styles.controlsRight}>
              {/* My Topics toggle */}
              {isUserAuthenticated && (
                <label className={styles.myTopicsToggle}>
                  <Switch
                    size="small"
                    checked={onlyMyTopicsCheck}
                    onChange={handleCheckbox}
                    disabled={loading}
                  />
                  My topics only
                </label>
              )}

              {/* Advanced Filters button */}
              <button
                className={`${styles.advancedBtn} ${showAdvanced ? styles.advancedBtnActive : ""}`}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                Filters
              </button>
            </div>
          </div>

          {/* Advanced filters panel */}
          <div className={`${styles.advancedPanel} ${showAdvanced ? styles.advancedPanelOpen : ""}`}>
            <div className={styles.advancedGrid}>
              {/* Algorithm */}
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Algorithm</span>
                <Select
                  size="small"
                  showSearch
                  optionFilterProp="children"
                  value={algorithms?.filter((a: any) => a.algorithm_key == algorithm)?.[0]?.algorithm_label}
                  onChange={selectAlgorithm}
                  disabled={loading}
                  style={{ minWidth: 160 }}
                >
                  {algorithms?.map((algo: any) => (
                    <Option key={algo.id} value={algo.algorithm_key}>{algo.algorithm_label}</Option>
                  ))}
                </Select>
              </div>

              {/* Community (namespace) */}
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Community</span>
                <Select
                  size="small"
                  showSearch
                  optionFilterProp="children"
                  value={changeSlashToArrow(selectedNameSpace)}
                  onChange={selectNameSpace}
                  disabled={loading}
                  style={{ minWidth: 160 }}
                >
                  {nameSpacesList?.map((item: any) => (
                    <Option key={item.id} value={item.id}>{changeSlashToArrow(item.label)}</Option>
                  ))}
                  <Option key="custom-key" value="">All</Option>
                </Select>
              </div>

              {/* Min score */}
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Min score</span>
                <Input
                  size="small"
                  onChange={filterOnScore}
                  value={inputScoreValue}
                  disabled={loading}
                  style={{ maxWidth: 80 }}
                />
              </div>

              {/* Checkboxes */}
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>Options</span>
                <div className={styles.checkboxGroup}>
                  <FullScoreCheckbox />
                  <ArchivedCampCheckBox />
                </div>
              </div>

              {/* As Of */}
              <div className={styles.filterGroup}>
                <span className={styles.filterLabel}>As of</span>
                <div className={styles.asOfGroup}>
                  <Radio.Group onChange={onAsOfChange} value={asOfValue} disabled={loading} size="small">
                    <Radio
                      value={1}
                      onClick={() => {
                        dispatch(setViewThisVersion(false));
                        setCookie("asof", "review", { path: "/" });
                        dispatch(setIsReviewCanonizedTopics({ includeReview: true, asof: "review", asofdate: Date.now() / 1000 }));
                        onChangeRoute(filterByScore, algorithm, "review", Date.now() / 1000);
                      }}
                    >
                      Review
                    </Radio>
                    <Radio
                      value={2}
                      onClick={() => {
                        dispatch(setViewThisVersion(false));
                        setCookie("asof", "default", { path: "/" });
                        dispatch(setFilterCanonizedTopics({ asofdate: Date.now() / 1000, asof: "default" }));
                        onChangeRoute(filterByScore, algorithm, "default", Date.now() / 1000);
                      }}
                    >
                      Default
                    </Radio>
                    <Radio
                      value={3}
                      onClick={() => {
                        dispatch(setViewThisVersion(false));
                        handleAsOfClick();
                      }}
                    >
                      Date
                    </Radio>
                  </Radio.Group>
                  <DatePicker
                    disabled={!loading ? (isDatePicker || asof == "bydate" ? false : true) : true}
                    format="YYYY-MM-DD"
                    defaultValue={moment(current_date_filter * 1000)}
                    value={moment(asofdate * 1000)}
                    size="small"
                    onChange={pickDate}
                    inputReadOnly
                    disabledDate={(current) => current && current > moment(current_date_filter).endOf("day")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Grid */}
        {getTopicsLoadingIndicator ? (
          <div className={styles.skeleton}>
            <CustomSkelton
              skeltonFor="list"
              bodyCount={10}
              stylingClass="listSkeleton"
              isButton={false}
            />
          </div>
        ) : topics.length === 0 ? (
          <div className={styles.skeleton}>No topics found.</div>
        ) : (
          <>
            <div className={styles.topicGrid}>
              {topics.map((item: any, index: number) => {
                const topicLink = `/topic/${item?.topic_id}-${replaceSpecialCharacters(
                  isReview
                    ? item?.tree_structure?.[1]?.review_title
                    : item?.topic_name,
                  "-"
                )}/1-Agreement`;

                const score = is_checked
                  ? item?.topic_full_score?.toFixed(2)
                  : item?.topic_score?.toFixed(2);

                const rawScore = item?.topic_score || 0;
                const fullScore = item?.topic_full_score || rawScore || 1;
                const greenPct = fullScore > 0 ? Math.round((rawScore / fullScore) * 100) : 50;
                const orangePct = Math.round((100 - greenPct) * 0.6);
                const redPct = 100 - greenPct - orangePct;

                const desc = item?.tree_structure?.[1]?.review_title || "";
                const participants = item?.tree_structure?.length || 0;

                return (
                  <Link href={topicLink} key={item?.topic_id || index}>
                    <a className={styles.topicCard} onClick={handleTopicClick}>
                      {getNamespaceLabel() && (
                        <div className={styles.topicCategory}>{getNamespaceLabel()}</div>
                      )}
                      {item.is_archive && (
                        <div className={styles.archiveLabel}>Archived</div>
                      )}
                      <div className={styles.topicTitle}>
                        {isReview
                          ? item?.tree_structure?.[1]?.review_title
                          : item?.topic_name}
                      </div>
                      {desc && (
                        <div className={styles.topicDesc}>{desc}</div>
                      )}
                      <div className={styles.topicFooter}>
                        <span className={styles.topicMeta}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                          </svg>
                          {participants} participants
                        </span>
                        <span className={styles.scorePill}>score: {score}</span>
                      </div>
                      <div className={styles.topicBar}>
                        <div className={styles.barSegG} style={{ width: `${greenPct}%` }} />
                        <div className={styles.barSegO} style={{ width: `${orangePct}%` }} />
                        <div className={styles.barSegR} style={{ width: `${redPct}%` }} />
                      </div>
                      <div className={styles.hoverOverlay}>
                        <span className={styles.hoverPill}>Take a position &rarr;</span>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>

            {/* Load more */}
            {topics.length > 1 && topics.length % 15 === 0 && (
              <div className={styles.loadMoreWrap}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={() => {
                    getTopicsApiCallWithReqBody(true);
                    setLoadMoreIndicator(true);
                  }}
                >
                  Load more topics
                  {loadMoreIndicator && <Spin indicator={antIcon} />}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  const currentDate = new Date().valueOf();
  return { props: { current_date: currentDate } };
}

BrowsePage.displayName = "BrowsePage";

export default BrowsePage;
