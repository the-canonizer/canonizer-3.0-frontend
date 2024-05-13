import { useRouter } from "next/router";
import {
  AutoComplete,
  Button,
  Collapse,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Popover,
  Radio,
  Select,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import styles from "./advanceSearchFilter.module.scss";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import filter from "src/assets/image/filter.svg";
import upArrow from "src/assets/image/ant-design--caret-up-filled.svg";
import Image from "next/image";
import { LeftOutlined } from "@ant-design/icons";
import { CloseCircleOutlined, CaretDownOutlined } from "@ant-design/icons";
import { AdvanceFilterSeacrhApi } from "src/network/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import {
  setClickAdvanceFilterOption,
  setSearchQueryValue,
  setSelectNickNameIdFromDirectSupportTree,
  setSelectNicknameIdFromGetApi,
  setSelectedTopicFromAdvanceFilterAlgorithm,
  setSelectedCampFromAdvanceFilterAlgorithm,
  setSelectedTopicFromAdvnaceFilterNickname,
} from "src/store/slices/searchSlice";
import debounce from "lodash/debounce";
import { getTreesApi } from "src/network/api/campDetailApi";
import { setFilterCanonizedTopics, setIsReviewCanonizedTopics, setViewThisVersion } from "../../../store/slices/filtersSlice";
import { getCanonizedTopicsApi } from "src/network/api/homePageApi";
import moment from "moment";
import K from "../../../constants";



export default function AdvanceFilter() {
  const [searchVal, setSearchVal] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);
  
  

  const { Panel } = Collapse;
  const { Title, Text, Paragraph } = Typography;
  const { Search } = Input;
const { Option } = Select;
const router = useRouter();
const panelColorRef = useRef(null);
  let {
    searchValue,
    searchQueryValue,
    supportTreeForCamp,
    asof,
    asofdate,
    algorithm,
    viewThisVersionCheck,
    algorithms,
    selectedAlgorithm,
    filterObject,
    viewThisVersion,
    campScoreValue,
    onlyMyTopicsCheck,
    userEmail,
    is_camp_archive_checked,
    sortLatestTopic,
    filterByScore,
    filteredScore,
    selectedAsOf,
    current_date_filter,
    filteredAsOfDate,
    loading,
    selectedCampFromAdvanceFilterAlgorithm
  } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
    searchQueryValue: state?.searchSlice?.searchQueryValue,
    campSupportingTree: supportTreeForCamp,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
    algorithms: state.homePage?.algorithms,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    filterObject: state?.filters?.filterObject,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    campScoreValue: state?.filters?.campWithScoreValue,
    onlyMyTopicsCheck: state?.filters?.onlyMyTopicsCheck,
    userEmail: state?.auth?.loggedInUser?.email,
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    sortLatestTopic: state?.utils?.sortLatestTopic,
    filterByScore: state.filters?.filterObject?.filterByScore,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    selectedAsOf: state?.filters?.filterObject?.asof,
    current_date_filter: state?.filters?.current_date,
    filteredAsOfDate: state?.filters?.filterObject?.asofdate,
    loading: state?.loading?.loading,
    selectedCampFromAdvanceFilterAlgorithm:
        state?.searchSlice?.selectedCampFromAdvanceFilterAlgorithm,
  }));
  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
  }));
  const findNicknameId = searchDataAll.nickname?.map((obj) => {
    return obj.id;
  });
  const findTopicId = searchDataAll.camp?.map((obj) => {
    return obj.topic_num;
  });

let stringTopicArray = findTopicId?.map(element => element.toString());
  const findCampId = searchDataAll.camp?.map((obj) => {
    return obj.camp_num;
  });
let stringCampArray = findCampId?.map(element => element.toString());

  const [timer, setTimer] = useState(null);
  const [inputValue, setInputValue] = useState(
    router.query.score || filteredScore
  );
  const [value, setValue] = useState(
    selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3
  );
  const [selectedAsOFDate, setSelectedAsOFDate] = useState(filteredAsOfDate);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [active,setActive] = useState([])
  const infoContent = (
    <>
      <div className={styles.infoText}>
        <Title level={5}>Score Value Filter </Title>
        <p>
          This option filters down the camp list with a score value greater than
          the entered value. By default, the score value filter is 0, displaying
          all camps.
        </p>
      </div>
    </>
  );

  const extractNumbers = (dataArray) => {
    return dataArray?.map((item) => {
      // Split each string by hyphen
      const parts = item.split("-");
      // Return the second part which contains the number
      return parseInt(parts[1], 10);
    });
  };
  const dispatch = useDispatch();
  const handleItemClick = (topic) => {
    dispatch(setSelectedTopicFromAdvnaceFilterNickname([topic]));
  };

  const advanceFilter = async (body) => {
    const response = await AdvanceFilterSeacrhApi(body);
    if (response) {
      setSearchTopics(response.data.topic);
      setSearchCamps(response.data.camp);
    }
  };
  const reqBody = {
    type: router.pathname == "/search/nickname" ? "nickname" : "",
    search: searchValue,
    query: searchQueryValue,
    nick_ids: extractNumbers(findNicknameId),
  };
  const debounceFn = useMemo(() => debounce(advanceFilter, 500), []);

  const Highlighted = ({ text = "", highlight = "" }) => {
    if (!highlight.trim()) {
      return <label>{text}</label>;
    }
    const escapedHighlight = highlight.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    );
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark className={`${styles.highlighter} p-0`} key={i}>
              {part}
            </mark>
          ) : (
            <span
              style={{ cursor: "pointer", fontWeight: "bold" }}
              className={styles.highlighter}
              key={i}
            >
              {part}
            </span>
          )
        )}
      </>
    );
  };
  interface MyObjectType {
    camp_id?: string; // Define the structure of the object
    support_tree?: any; // Update 'any' with the correct type if possible
  }

  const getNicknameFromSupportTree = async (reqBodyForService, camp_num) => {
    const response = await getTreesApi(reqBodyForService);
    const treeData = response?.treeData;
    const children = treeData && treeData["1"] && treeData["1"].children;
    const getChildren = children
      ? Object.values(response?.treeData?.["1"]?.children).map((value:MyObjectType) => {
          return {
            campId: value?.camp_id,
            supportTree: value?.support_tree,
          };
        })
      : [];
    const supportTree = response?.treeData['1'].support_tree;
    const getNIcknameIdFromDirectSupportTree =supportTree.map((obj)=>{
      return obj.nick_name_id
    })
    const filtercampId = getChildren?.reduce((acc, obj) => {
        if (obj.campId === camp_num) {
            acc = obj.supportTree;
        }
        return acc;
    }, []);
    
    const getNickId = filtercampId?.map((obj) => {
      return obj.nick_name_id;
    });  
    dispatch(setSelectNicknameIdFromGetApi(getNickId));
    dispatch(setSelectNickNameIdFromDirectSupportTree(getNIcknameIdFromDirectSupportTree))
  };
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

    if (asof == "bydate") {
      query.asofdate = asofdate;
    }

    if (viewversion) {
      query.viewversion = "1";
    }

    router.query = { ...router?.query, ...query };

    if (asof != "bydate") {
      delete router.query.asofdate;
    }

    if (String(filterByScore) === "0") {
      delete router.query.score;
    }

    if (String(namespace_id) === "1") {
      delete router.query.canon;
    }

    if (!namespace_id && String(namespace_id) === "0") {
      delete router.query.canon;
    }

    if (asof === "default") {
      delete router.query.asof;
    }

    if (!query?.canon) {
      delete router.query.canon;
    }

    if (algorithm === "blind_popularity") {
      delete router.query.algo;
    }

    if (String(campScoreValue) === "10") {
      delete router.query.filter;
    }

    if (
      router.query.filter === "undefined" ||
      router.query.filter === undefined ||
      router.query.filter === "null" ||
      router.query.filter === null
    ) {
      delete router.query.filter;
    }

    router.replace(router, null, { shallow: true });
  };
  const selectAlgorithm = (value) => {
    dispatch(setFilterCanonizedTopics({ algorithm: value }));
    onChangeRoute(
      filterObject?.filterByScore,
      value,
      filterObject?.asof,
      filterObject?.asofdate,
      filterObject?.namespace_id,
      viewThisVersion
    );
    // getTopicsApiCallWithReqBody()
  };

  async function getTopicsApiCallWithReqBody() {
    // loadMore ? setPageNumber(pageNumber + 1) : setPageNumber(1);
    const rebody={
    type: "topic",
    search: searchValue,
    query: "",
    algo: algorithm,
    asof:asof,
    score:filterByScore,
    }
  const response = await AdvanceFilterSeacrhApi(rebody);
  dispatch(setSelectedTopicFromAdvanceFilterAlgorithm(response?.data?.topic))
    // setLoadMoreIndicator(false);
  }
  async function getCampsApiCallWithReqBody() {
    // loadMore ? setPageNumber(pageNumber + 1) : setPageNumber(1);
    const rebody={
    type:"camp",
    search: "",
    query: "",
    algo: algorithm,
    asof:asof,
    score:filterByScore,
    camp_ids: stringCampArray,
    topic_ids: stringTopicArray,
    }
  const response = await AdvanceFilterSeacrhApi(rebody);
  dispatch(setSelectedCampFromAdvanceFilterAlgorithm(response?.data?.camp))
    // setLoadMoreIndicator(false);
  }
  const filterOnScore = (e) => {
    const { value } = e.target;
    setInputValue(value);
    clearTimeout(timer);
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      const newTimer = setTimeout(() => {
        dispatch(
          setFilterCanonizedTopics({
            filterByScore: value,
          })
        );
        onChangeRoute(
          value,
          filterObject?.algorithm,
          filterObject?.asof,
          filterObject?.asofdate,
          filterObject?.namespace_id,
          viewThisVersion
        );
      }, 1000);
      setTimer(newTimer);
    }
    // getTopicsApiCallWithReqBody()
  };
  const onChange = (e) => {
    if (e.target.value === 3) {
      setIsDatePicker(true);
    } else {
      setIsDatePicker(false);
    }
    setValue(e.target.value);
  };
  useEffect(() => {
    setValue(selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3);
    panelColorRef.current = selectedAsOf;
  }, [selectedAsOf]);
  const handleAsOfClick = () => {
    if (datePickerValue !== null) {
      let dateValue =
        moment().unix() > moment(datePickerValue).unix() &&
        moment().format("YYYY-MM-DD") >
          moment(datePickerValue).format("YYYY-MM-DD")
          ? momentDateObject(moment(datePickerValue).endOf("day"))
          : momentDateObject(
              moment(datePickerValue).set({
                hour: moment().hour(),
                minute: moment().minute(),
                second: moment().second(),
              })
            );
      dispatch(
        setFilterCanonizedTopics({
          asofdate: Date.parse(dateValue) / 1000,
          asof: "bydate",
        })
      );
      onChangeRoute(
        filterObject?.filterByScore,
        filterObject?.algorithm,
        "bydate",
        Date.parse(dateValue) / 1000,
        filterObject?.namespace_id,
        viewThisVersion
      );
    } else {
      dispatch(
        setFilterCanonizedTopics({
          asofdate: Date.now() / 1000,
          asof: "bydate",
        })
      );
      onChangeRoute(
        filterObject?.filterByScore,
        filterObject?.algorithm,
        "bydate",
        Date.now() / 1000,
        filterObject?.namespace_id,
        viewThisVersion
      );
    }
  };
  function momentDateObject(e) {
    return e?._d;
  }
  const pickDate = (e) => {
    dispatch(setViewThisVersion(false));
    let IsoDateFormat;
    if (e == null) {
      IsoDateFormat = Date.now() / 1000;
    } else {
      let datepicker =
        moment().unix() > moment(e?._d).unix() &&
        moment().format("YYYY-MM-DD") > moment(e?._d).format("YYYY-MM-DD")
          ? momentDateObject(moment(e?._d).endOf("day"))
          : momentDateObject(
              moment(e?._d).set({
                hour: moment().hour(),
                minute: moment().minute(),
                second: moment().second(),
              })
            );
      setDatePickerValue(datepicker);
      IsoDateFormat = Date.parse(datepicker) / 1000;
    }

    dispatch(
      setFilterCanonizedTopics({
        asofdate: IsoDateFormat,
        asof: "bydate",
      })
    );
    onChangeRoute(
      filterObject?.filterByScore,
      filterObject?.algorithm,
      "bydate",
      IsoDateFormat,
      filterObject?.namespace_id,
      viewThisVersion
    );
  };
  useEffect(() => {
    setSelectedAsOFDate(filteredAsOfDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAsOfDate]);

  useEffect(() => {
    if(router.pathname == "/search/topic"){
    getTopicsApiCallWithReqBody()
    }if(router.pathname == "/search/camp"){
    getCampsApiCallWithReqBody()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asof,filterByScore,algorithm]);
  const handleCollapseChange = (key) => {
    setActive(key);
    // Do something with the collapsed key
  };
  const handleClosePanel = () => {
    setActive([]); 
  };
  const panelRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setActive([]); // Close the panel if click occurs outside of it
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div ref={panelRef}
      className={
        router?.pathname !== "/search/nickname"
          ? "advanceFilter"
          : "NicknameadvanceFilter advanceFilter"
      }
    >
      <Collapse
        className={`${styles.cardAccordian} topicListFilterCardCollapse`}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <CaretDownOutlined rotate={isActive ? 180 : 180} />
        )}
        bordered={false}
        activeKey={active}
        onChange={handleCollapseChange}
        // accordion={searchVal ?false:true}
      >
        <Panel
          header={
            <span className="filter-heading">
              <Image
                id="viewFile"
                alt="Eye Image"
                src={filter}
                width={15}
                height={11}
              />
              Advance Filter
            </span>
          }
          key={"1"}
        >
          <div className="advance_close">
            <CloseCircleOutlined onClick={handleClosePanel} />
          </div>

          {router?.pathname !== "/search/nickname" ? (
            <div className="row">
              <div className="col-sm-6">
                <h4>Canonizer</h4>
                <label>Canonizer Algorithm:</label>
            <Select
            size="large"
            showSearch
            optionFilterProp="children"
            className={"w-100"}
            defaultValue={
              algorithms?.filter(
                (algo) => algo.algorithm_key == selectedAlgorithm
              )[0]?.algorithm_label
            }
            onChange={selectAlgorithm}
            value={
              algorithms?.filter(
                (algo) => algo.algorithm_key == selectedAlgorithm
              )[0]?.algorithm_label
            }
            // disabled={loading}
          >
            {algorithms?.map((algo) => {
              return (
                <Option key={algo.id} value={algo.algorithm_key}>
                  {algo.algorithm_label}
                </Option>
              );
            })}
          </Select>
          {router?.asPath.includes("/topic") ? (
                <a href={K?.Network?.URL?.algoInfoUrl}>Algorithm Information</a>
              ) : (
                <Link href={K?.Network?.URL?.algoInfoUrl}>
                  <a>Algorithm Information</a>
                </Link>
              )}
                <div className="score-box">
                  <label>Score</label>

                  <LeftOutlined className={styles.LeftOutlined} />
                  <Input size="large" value={inputValue} onChange={filterOnScore}/>
                  <Popover
              content={infoContent}
              placement="right"
              className={styles.infoIcon}
            >
              <i className="icon-info"></i>
            </Popover>
                </div>
              </div>
              <div className="col-sm-6">
                <h4>Search Type</h4>
                <Radio.Group onChange={onChange} value={value}>
                <Radio
                  value={1}
                  onClick={() => {
                    dispatch(setViewThisVersion(false));
                    dispatch(
                      setIsReviewCanonizedTopics({
                        includeReview: true,
                        asof: "review",
                        asofdate: Date.now() / 1000,
                      })
                    );
                    onChangeRoute(
                      filterObject?.filterByScore,
                      filterObject?.algorithm,
                      "review",
                      Date.now() / 1000,
                      filterObject?.namespace_id,
                      viewThisVersion
                    );
                    // getTopicsApiCallWithReqBody()

                  }}
                >
                 Search include review
                </Radio>
                <Radio
                  className={styles.radio + " topicFilterRadio"}
                  value={2}
                  onClick={() => {
                    dispatch(setViewThisVersion(false));
                    dispatch(
                      setFilterCanonizedTopics({
                        asofdate: Date.now() / 1000,
                        asof: "default",
                      })
                    );
                    onChangeRoute(
                      filterObject?.filterByScore,
                      filterObject?.algorithm,
                      "default",
                      Date.now() / 1000,
                      filterObject?.namespace_id,
                      viewThisVersion
                    );
                  }}
                >
                  Default
                </Radio>
                <Radio
                  className={styles.radio + " topicFilterRadio"}
                  value={3}
                  onClick={() => {
                    dispatch(setViewThisVersion(false));
                    handleAsOfClick();
                    // getTopicsApiCallWithReqBody()

                  }}
                >
                  Search historical
                </Radio>
                </Radio.Group>
                <DatePicker
              disabled={
                !loading
                  ? isDatePicker || selectedAsOf == "bydate"
                    ? false
                    : true
                  : true
              }
              format="YYYY-MM-DD"
              defaultValue={moment(current_date_filter * 1000)}
              value={moment(selectedAsOFDate * 1000)}
              suffixIcon={<i className="icon-calendar"></i>}
              size={"large"}
              className={`${styles.date} w-100`}
              onChange={pickDate}
              inputReadOnly={true}
              disabledDate={(current) =>
                current && current > moment(current_date_filter).endOf("day")
              }
            />
              </div>
            </div>
          ) : (
            <div className="nicknameAdvanceFilter">
              <label>Search for Topic or Camp </label>
              <Input
                size="large"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  dispatch(setSearchQueryValue(e.target.value));
                  reqBody.query = e.target.value;
                  debounceFn(reqBody);
                }}
                placeholder="Search a Keyword"
              />
              {searchTopics.length || searchCamps.length?<div className="advance_filter_dropdown">
                {searchVal ? (
                  <div className="search_outer">
                    {searchTopics.length ? (
                      <label>
                        <i className="icon-topic"></i>
                        <span>Topic</span>
                      </label>
                    ) : (
                      ""
                    )}
                    <div className={styles.search_list}>
                      <ul>
                        {searchTopics?.map((x: any) => {
                          {
                            const reqBodyForService = {
                              topic_num: x.topic_num,
                              camp_num: x.camp_num,
                              asOf: asof,
                              asofdate:
                                asof == "default" || asof == "review"
                                  ? Date.now() / 1000
                                  : asofdate,
                              algorithm: algorithm,
                              update_all: 1,
                              fetch_topic_history: viewThisVersionCheck
                                ? 1
                                : null,
                            };
                            return (
                              <>
                                <li style={{ cursor: "default" }}>
                                  <a
                                    onClick={() => {
                                      dispatch(
                                        setClickAdvanceFilterOption(true)
                                      );
                                      handleItemClick(x.title);
                                      getNicknameFromSupportTree(
                                        reqBodyForService,
                                        x.camp_num
                                      );
                                    }}
                                  >
                                    <Highlighted
                                      text={x.title}
                                      highlight={searchVal}
                                    />
                                  </a>
                                  {/* </Link> */}
                                </li>
                              </>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {searchVal ? (
                  <div className="search_outer">
                    {searchCamps.length ? (
                      <label>
                        <i className="icon-camp"></i>
                        <span>camp</span>
                      </label>
                    ) : (
                      ""
                    )}
                    <div className={styles.search_lists}>
                      <ul>
                        {searchCamps?.slice(0, 5)?.map((x) => {
                          const jsonData = JSON.parse(
                            x.breadcrumb
                          ) as Array<any>;
                          const parsedData = jsonData.reduce(
                            (accumulator, currentVal, index) => {
                              const accIndex = index + 1;
                              accumulator[index] = {
                                camp_name:
                                  currentVal[accIndex]?.camp_name == "Agreement"
                                    ? currentVal[accIndex]?.topic_name
                                    : currentVal[accIndex]?.camp_name,
                                camp_link: currentVal[accIndex]?.camp_link,
                              };
                              return accumulator;
                            },
                            []
                          );
                          {
                            const reqBodyForService = {
                              topic_num: x.topic_num,
                              camp_num: x.camp_num,
                              asOf: asof,
                              asofdate:
                                asof == "default" || asof == "review"
                                  ? Date.now() / 1000
                                  : asofdate,
                              algorithm: algorithm,
                              update_all: 1,
                              fetch_topic_history: viewThisVersionCheck
                                ? 1
                                : null,
                            };
                            return (
                              <>
                                <li style={{ cursor: "default" }}>
                                  <a
                                    className={styles.camp_heading_color}
                                    onClick={() => {
                                      dispatch(
                                        setClickAdvanceFilterOption(true)
                                      );
                                      handleItemClick(x.title);
                                      getNicknameFromSupportTree(
                                        reqBodyForService,
                                        x.camp_num
                                      )                                     
                                    }}
                                  >
                                    {" "}
                                    <Highlighted
                                      text={x.title}
                                      highlight={searchVal}
                                    />
                                  </a>
                                  <div
                                    className={
                                      styles.tags_all_search_camp_statement
                                    }
                                  >
                                    {parsedData
                                      ?.reverse()
                                      ?.map((obj, index) => {
                                        return (
                                          <a
                                            href={`/${obj.camp_link}`}
                                            key={`/${obj.camp_link}`}
                                          >
                                            {obj.camp_name}
                                            {index < parsedData?.length - 1
                                              ? "/ "
                                              : ""}
                                          </a>
                                        );
                                      })}
                                  </div>
                                </li>
                              </>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>:<div>
              {searchVal?<Empty description={"No data found"}/>:""}
                </div>}
            </div>
          )}
        </Panel>
      </Collapse>
    </div>
  );
}
