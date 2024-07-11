import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Typography,
  Collapse,
  Select,
  Radio,
  Space,
  Input,
  DatePicker,
  Popover,
  Row,
  Col,
  Button,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import Image from "next/image";

import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setIsReviewCanonizedTopics } from "../../../store/slices/filtersSlice";
import Link from "next/link";
import { useCookies } from "react-cookie";

import {
  setViewThisVersion,
  setFilterCanonizedTopics,
} from "src/store/slices/filtersSlice";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { useRouter } from "next/router";
import K from "src/constants";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import FullScoreCheckbox from "../../ComponentPages/FullScoreCheckbox";
import ArchivedCampCheckBox from "src/components/ComponentPages/ArchivedCampCheckBox";
import CampTreeCard from "src/components/ComponentPages/TopicDetails/CampTreeCard";
import { getTreesApi } from "src/network/api/campDetailApi";
import { setOpenDrawer } from "../../../store/slices/campDetailSlice";

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

const asContent = (
  <>
    <div className={styles.asfoText}>
      <Title level={5}>Include review</Title>
      <Paragraph>
        In addition to the published camps, this option shows camps in Review.
      </Paragraph>
      <Title level={5}>Default</Title>
      <Paragraph>
        This option lists down the latest (current date) version of camps.
      </Paragraph>
      <Title level={5}>As of date</Title>
      <Paragraph>
        This option shows the historical view of camps according to the selected
        date.
      </Paragraph>
    </div>
  </>
);

const FilterWithTree = ({
  getTreeLoadingIndicator,
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  backGroundColorClass,
  loadingIndicator,
  isForumPage = false,
}: any) => {
  const [isDatePicker, setIsDatePicker] = useState(false);

  const [datePickerValue, setDatePickerValue] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // eslint-disable-next-line no-unused-vars
  const [_cookie, setCookie] = useCookies(["canAlgo", "asof", "asofDate"]);

  const {
    algorithms,
    filteredScore,
    selectedAlgorithm,
    selectedAsOf,
    filteredAsOfDate,
    loading,
    current_date_filter,
    filterObject,
    viewThisVersion,
    campScoreValue,
    asof,
    viewThisVersionCheck,
    asofdate,
    algorithm,
  } = useSelector((state: RootState) => ({
    algorithms: state.homePage?.algorithms,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    selectedAsOf: state?.filters?.filterObject?.asof,
    filteredAsOfDate: state?.filters?.filterObject?.asofdate,
    loading: state?.loading?.loading,
    current_date_filter: state?.filters?.current_date,
    filterObject: state?.filters?.filterObject,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    campScoreValue: state?.filters?.campWithScoreValue,
    asof: state?.filters?.filterObject?.asof,
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
  }));

  const [value, setValue] = useState(
    selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3
  );
  const [selectedAsOFDate, setSelectedAsOFDate] = useState(filteredAsOfDate);
  const [timer, setTimer] = useState(null);
  const [inputValue, setInputValue] = useState(
    router.query.score || filteredScore
  );
  const [isLoading, setIsLoading] = useState(loading);
  const didMount = useRef(false);

  function removeEmptyValues(obj) {
    const result = {};
    for (const key in obj) {
      const value = obj[key];

      if (value && value != "undefined") {
        result[key] = value;
      }
    }
    return result;
  }

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

    router.query = { ...router?.query, ...query };

    if (asof !== "bydate") {
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

  useEffect(() => {
    if (router?.query?.canon) {
      dispatch(setFilterCanonizedTopics({ namespace_id: router.query.canon }));
    }

    if (
      String(filterObject?.filterByScore) !== "0" ||
      String(filterObject?.namespace_id) !== "1" ||
      filterObject?.asof !== "default" ||
      filterObject?.algorithm !== "blind_popularity" ||
      campScoreValue !== 10
    ) {
      onChangeRoute(
        +router.query.score || filteredScore || 0,
        (
          router.query.algo ||
          filterObject?.algorithm ||
          "blind_popularity"
        )?.toString(),
        (router.query.asof || filterObject?.asof || "default")?.toString(),
        +router.query.asofdate || filterObject?.asofdate,
        +router.query.canon,
        viewThisVersion
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      let newObject = removeEmptyValues({
        filterByScore: router.query.score || `${filteredScore}` || "0",
        asofdate: router.query.asofdate || filterObject?.asofdate,
        asof: router.query.asof || filterObject?.asof || "default",
        algorithm:
          router.query.algo || filterObject?.algorithm || "blind_popularity",
        namespace_id: +router.query.canon,
      });

      dispatch(setFilterCanonizedTopics(newObject));
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    setValue(selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3);
  }, [selectedAsOf]);

  useEffect(() => {
    setSelectedAsOFDate(filteredAsOfDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAsOfDate]);

  useEffect(() => {
    if (!(algorithms?.length > 0)) getCanonizedAlgorithmsApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const reqBodyForService = {
    topic_num: router?.query?.camp[0]?.split("-")[0],
    camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    asOf: asof,
    asofdate:
      asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
    algorithm: algorithm,
    update_all: 1,
    fetch_topic_history: viewThisVersionCheck ? 1 : null,
  };
  const revertScore = () => {
    getTreesApi(reqBodyForService);
  };
  const selectAlgorithm = (value) => {
    setCookie("canAlgo", value, {
      path: "/",
    });
    dispatch(
      setFilterCanonizedTopics({
        algorithm: value,
      })
    );
    onChangeRoute(
      filterObject?.filterByScore,
      value,
      filterObject?.asof,
      filterObject?.asofdate,
      filterObject?.namespace_id,
      viewThisVersion
    );
    revertScore();
  };
  const onChange = (e) => {
    if (e.target.value === 3) {
      setIsDatePicker(true);
    } else {
      setIsDatePicker(false);
    }
    setValue(e.target.value);
  };

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

    setCookie("asofDate", JSON.stringify(IsoDateFormat), {
      path: "/",
    });
    setCookie("asof", "bydate", {
      path: "/",
    });

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
  };

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
      setCookie("asofDate", JSON.stringify(Date.parse(dateValue) / 1000), {
        path: "/",
      });
      setCookie("asof", "bydate", {
        path: "/",
      });
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
  const handleRadioClick = (value) => {
    setSelectedValue(value);
  };
  const handleApplyClick = () => {
    if (selectedValue === 2) {
      dispatch(setViewThisVersion(false));
      setCookie("asof", "default", { path: "/" });
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
    } else if (selectedValue === 1) {
      dispatch(setViewThisVersion(false));
      setCookie("asof", "review", {
        path: "/",
      });
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
    } else if (selectedValue === 3) {
      dispatch(setViewThisVersion(false));
      handleAsOfClick();
    }
  };
  const onClose = () => {
    dispatch(setOpenDrawer(false));
  };
  return (
    <div className="leftSideBar_Card drawer_card">
      <div
        className={`${styles.cardAccordian} ${styles.cardWithDrawerAccordian} topicListFilterCardCollapse`}
        // expandIconPosition="right"
        // bordered={false}
        // defaultActiveKey={["1"]}
      >
        <div
          className={`header-bg-color-change radio-group-sider ${selectedAsOf}`}
          // header={null}
          key="1"
        >
          <Row gutter={20}>
            <Col xs={24}>
              <div className="algo_title_new border-b border-canGrey2  mb-3.5 p-5">
                <Title level={5} className={styles.algoText}>
                  Select Canonizer Algorithm:{"  "}{" "}
                  <Popover
                    content="Algorithm Information"
                    placement="top"
                    className={styles.algoInfoIcon}
                  >
                    {router?.asPath.includes("/topic") ? (
                      <a
                        href={K?.Network?.URL?.algoInfoUrl}
                        className="d-flex items-center "
                      >
                        {/* {/ <i className="icon-info"></i>  /} */}
                        <Image
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={16}
                          width={16}
                        />
                      </a>
                    ) : (
                      <Link href={K?.Network?.URL?.algoInfoUrl}>
                        <a>
                          {/* {/ <i className="icon-info"></i>  /} */}
                          <Image
                            src="/images/circle-info-bread.svg"
                            alt="svg"
                            className="icon-topic"
                            height={16}
                            width={16}
                          />
                        </a>
                      </Link>
                    )}
                  </Popover>
                </Title>
                <Select
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  className={styles.algoSelect}
                  defaultValue={
                    algorithms?.filter(
                      (algo) => algo?.algorithm_key == selectedAlgorithm
                    )[0]?.algorithm_label
                  }
                  onChange={selectAlgorithm}
                  value={
                    !router?.query?.algo
                      ? algorithms && algorithms[0]?.algorithm_label
                      : algorithms?.filter(
                          (algo) => algo?.algorithm_key == selectedAlgorithm
                        )[0]?.algorithm_label
                  }
                  disabled={loadingIndicator}
                  id="algo_dropdown"
                >
                  {algorithms?.map((algo) => {
                    return (
                      <Option
                        key={algo.id}
                        value={algo.algorithm_key}
                        id={"algo_drop_item_" + algo?.id}
                      >
                        {algo.algorithm_label}
                      </Option>
                    );
                  })}
                </Select>
              </div>
            </Col>
            <Col
              className=""
              xs={24}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <div className="score_value mb-3.5 pt-2.5 px-5 pb-7 w-full border-b border-canGrey2">
                <Text className={styles.filterText}>
                  <p className="d-flex items-center gap-1">
                    {" "}
                    Score value{" "}
                    <Image
                      src="/images/circle-info-bread.svg"
                      alt="svg"
                      className="icon-topic"
                      height={16}
                      width={16}
                    />
                  </p>{" "}
                </Text>
                {/* {/ <LeftOutlined className={styles.LeftOutlined} />  /} */}
                <Input
                  size="large"
                  onChange={filterOnScore}
                  value={
                    filteredScore == 0 ? filterObject.filterByScore : inputValue
                  }
                  disabled={loadingIndicator}
                  id="filter_input"
                />
                <Popover
                  content={infoContent}
                  placement="right"
                  className={styles.infoIcon}
                >
                  {/* {/ <i className="icon-info"></i>  /} */}
                </Popover>
              </div>
            </Col>
            {/* <Col md={24} className="mt-5">
              <div className={styles.scoreCheckbox}>
                <FullScoreCheckbox loadingIndicator={loadingIndicator} />
              </div>
              <ArchivedCampCheckBox loadingIndicator={loadingIndicator} />
            </Col> */}
            <Col xs={24} className="">
              {/* <div className={`${styles.algo_title} ${styles.title}`}> / */}
              <div className="as-of-div mb-3.5 pt-2.5 px-5 pb-7 w-full">
                <Title level={5} className={styles.algoText}>
                  As Of
                  <Popover content={asContent} placement="right">
                    <Image
                      src="/images/circle-info-bread.svg"
                      alt="svg"
                      className="icon-topic"
                      height={16}
                      width={16}
                    />
                  </Popover>
                </Title>
                <Space
                  direction="horizontal"
                  style={{ gap: "12px", width: "100%" }}
                  className={styles.radioInputs}
                >
                  <Radio.Group
                    onChange={onChange}
                    value={value}
                    disabled={loadingIndicator}
                    className={styles.radioBtns}
                    id="radio_group"
                  >
                    <Space
                      direction="horizontal"
                      style={{
                        gap: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Radio
                        className={styles.radio + " topicFilterRadio"}
                        value={2}
                        onClick={() => {
                          handleRadioClick(2);
                        }}
                        id="default_input"
                      >
                        Default
                      </Radio>
                      <Radio
                        className={styles.radio + " topicFilterRadio"}
                        style={{ width: "100%" }}
                        value={1}
                        onClick={() => {
                          handleRadioClick(1);
                        }}
                        id="review_input"
                      >
                        Include review
                      </Radio>
                      <div className="d-flex justify-between items-center">
                        <Radio
                          className={styles.radio + " topicFilterRadio"}
                          value={3}
                          onClick={() => {
                            handleRadioClick(3);
                          }}
                          id="as_input"
                        >
                          Set Custom date
                        </Radio>
                        <div className="d-flex">
                          <DatePicker
                            disabled={
                              isDatePicker || selectedAsOf == "bydate"
                                ? false
                                : true
                            }
                            format="YYYY-MM-DD"
                            defaultValue={moment(current_date_filter * 1000)}
                            value={moment(selectedAsOFDate * 1000)}
                            suffixIcon={<i className="icon-calendar"></i>}
                            size={"large"}
                            className={`${styles.date} ${styles.dates} w-100`}
                            onChange={pickDate}
                            inputReadOnly={true}
                            disabledDate={(current) =>
                              current &&
                              current > moment(current_date_filter).endOf("day")
                            }
                            id="date_input"
                          />
                          {/* <Popover
                    content={""}
                    placement="right"
                    className={styles.infoIcon}
                  >
                    <i
                      className="icon-info"
                      style={{ visibility: "hidden", width: "40px" }}
                    ></i>
                  </Popover> */}
                        </div>
                      </div>
                    </Space>
                  </Radio.Group>
                </Space>
              </div>
            </Col>
            <Col md={24}>
              <div className={styles.treeContainer}>
                <CampTreeCard
                  getTreeLoadingIndicator={getTreeLoadingIndicator}
                  scrollToCampStatement={scrollToCampStatement}
                  setTotalCampScoreForSupportTree={
                    setTotalCampScoreForSupportTree
                  }
                  backGroundColorClass={backGroundColorClass}
                  setSupportTreeForCamp={setSupportTreeForCamp}
                  isForumPage={isForumPage}
                />
              </div>
            </Col>

            <Col xs={24} className=" refine-drawer-mobile overflow-hidden">
              <div className="flex items-center justify-between sm:gap-0 lg:gap-2 btn-parent  lg:px-1 sm:px-0 fixed lg:static bottom-0 w-full">
                <Button
                  className="btnCancel border-t border-canBlue bg-transparent  lg:rounded-lg lg:h-[44px] h-[67px]  "
                  onClick={onClose}
                >
                  Cancel
                </Button>

                <Button
                  className="btnApplyfilters border-none lg:rounded-lg lg:h-[44px] h-[67px] bg-canBlue !text-white"
                  onClick={handleApplyClick}
                >
                  Apply
                  <Image
                    src="/images/filterbtn-icon.svg"
                    alt="svg"
                    className="icon-topic"
                    height={24}
                    width={24}
                  />
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default FilterWithTree;
