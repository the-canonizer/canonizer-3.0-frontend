import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import {
  Typography,
  Select,
  Radio,
  Space,
  Input,
  DatePicker,
  Popover,
  Row,
  Col,
} from "antd";
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
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { useRouter } from "next/router";
import K from "src/constants";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import CampTreeCard from "src/components/ComponentPages/TopicDetails/CampTreeCard";
import { getTreesApi } from "src/network/api/campDetailApi";
import {
  setOpenDrawer,
  setAsOfValues,
  setClearAlgoFromRefineFilter,
  setClearScoreFromRefineFilter,
} from "../../../store/slices/campDetailSlice";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

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
    openDrawer,
    asOfValues,
    clearAlgoFromRefineFilter,
    clearScoreFromRefineFilter,
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
    openDrawer: state.topicDetails.openDrawer,
    asOfValues: state.topicDetails.asOfValues,
    clearAlgoFromRefineFilter: state.topicDetails.clearAlgoFromRefineFilter,
    clearScoreFromRefineFilter: state.topicDetails.clearScoreFromRefineFilter,
  }));

  const [selectedAsOFDate, setSelectedAsOFDate] = useState(filteredAsOfDate);
  const [selectAlgo, setSelectAlgo] = useState(
    algorithms?.filter((algo) => algo?.algorithm_key == selectedAlgorithm)[0]
      ?.algorithm_label
  );

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!router?.query?.algo) {
      setSelectAlgo("blind_popularity");
      dispatch(setClearAlgoFromRefineFilter("blind_popularity"));
      if (!router?.query?.score) {
        dispatch(setClearScoreFromRefineFilter(0));
      }
      if (router?.query?.asof !== "bydate" || !router?.query?.asofdate) {
        handleRadioClick(2);
      }
    }
  }, [openDrawer]);
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
    // setValue(selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3);
    dispatch(
      setAsOfValues(
        selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3
      )
    );
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
    algorithm: clearAlgoFromRefineFilter,
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
        algorithm: clearAlgoFromRefineFilter,
      })
    );

    revertScore();
  };
  const onChange = (e) => {
    if (e.target.value === 3) {
      setIsDatePicker(true);
    } else {
      setIsDatePicker(false);
    }
    dispatch(setAsOfValues(e.target.value));
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
      setSelectedAsOFDate(Date.parse(datepicker) / 1000);
      setDatePickerValue(datepicker);
      IsoDateFormat = Date.parse(datepicker) / 1000;
    }

    setCookie("asofDate", JSON.stringify(IsoDateFormat), {
      path: "/",
    });
    setCookie("asof", "bydate", {
      path: "/",
    });
  };

  const filterOnScore = (value) => {
    // const { value } = e?.target;
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
        clearScoreFromRefineFilter,
        clearAlgoFromRefineFilter,
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
        clearAlgoFromRefineFilter,
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
    filterOnScore(clearScoreFromRefineFilter);
    selectAlgorithm(clearAlgoFromRefineFilter);
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
        clearScoreFromRefineFilter,
        clearAlgoFromRefineFilter,
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
        clearScoreFromRefineFilter,
        clearAlgoFromRefineFilter,
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

  const handleChange = (event) => {
    const value = event.target.value;
    dispatch(setClearScoreFromRefineFilter(Number(value)));
  };

  return (
    <div className="leftSideBar_Card drawer_card">
      <div
        className={`${styles.cardAccordian} ${styles.cardWithDrawerAccordian} topicListFilterCardCollapse`}
      >
        <div
          className={`header-bg-color-change radio-group-sider ${selectedAsOf}`}
          key="1"
        >
          <Row gutter={20}>
            <Col xs={24}>
              <div className="algo_title_new border-b lg:border-canGrey2 border-canLightgrey4 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 lg:pt-0 pt-6 ">
                <Title
                  level={5}
                  className="!text-xs !font-normal flex gap-1 !mb-2"
                >
                  Select Canonizer Algorithm
                  <Popover
                    content="Algorithm Information"
                    placement="top"
                    className={styles.algoInfoIcon}
                  >
                    {router?.asPath.includes("/topic") ? (
                      <a
                        href={K?.Network?.URL?.algoInfoUrl}
                        className="flex items-center "
                      >
                        <Image
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={12}
                          width={12}
                        />
                      </a>
                    ) : (
                      <Link href={K?.Network?.URL?.algoInfoUrl}>
                        <a>
                          <Image
                            src="/images/circle-info-bread.svg"
                            alt="svg"
                            className="icon-topic"
                            height={12}
                            width={12}
                          />
                        </a>
                      </Link>
                    )}
                  </Popover>
                </Title>
                <Select
                  suffixIcon={
                    <Image
                      src="/images/refine-caret-icon.svg"
                      width={15}
                      height={7}
                    />
                  }
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  className="commonSelectClass [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selection-item]:text-xs [&_.ant-select-selection-item]:!font-medium lg:w-4/5 w-full"
                  defaultValue={
                    algorithms?.filter(
                      (algo) => algo?.algorithm_key == selectedAlgorithm
                    )[0]?.algorithm_label
                  }
                  onChange={(algo) => {
                    dispatch(setClearAlgoFromRefineFilter(algo));
                  }}
                  value={clearAlgoFromRefineFilter}
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
            <Col className="flex justify-center items-end" xs={24}>
              <div className="score_value pr-4 lg:pr-8  pl-4 lg:pl-8 pb-8 pt-8 w-full border-b lg:border-canGrey2 border-canLightgrey4 ">
                <Text className={`${styles.filterText} !mb-0`}>
                  <p className="flex items-center gap-1 text-xs font-normal !mb-2">
                    Score value
                    <Popover
                      content={infoContent}
                      placement="right"
                      className={styles.infoIcon}
                    >
                      <Image
                        src="/images/circle-info-bread.svg"
                        alt="svg"
                        className="icon-topic"
                        height={12}
                        width={12}
                      />
                    </Popover>
                  </p>{" "}
                </Text>
                <Input
                  size="large"
                  className="rounded-lg lg:!w-4/5 w-full text-sm text-canBlack font-medium"
                  onChange={handleChange}
                  value={clearScoreFromRefineFilter}
                  disabled={loadingIndicator}
                  id="filter_input"
                  prefix={
                    <span className="text-canLight text-sm font-medium">
                      Greater than -
                    </span>
                  }
                />
              </div>
            </Col>
            <Col xs={24} className="">
              <div className="as-of-div pl-4 lg:pl-8 pb-8 pt-8 w-full">
                <Title
                  level={5}
                  className="!text-xs !font-normal flex gap-3 !mb-4"
                >
                  As Of
                  <Popover content={asContent} placement="right">
                    <Image
                      src="/images/circle-info-bread.svg"
                      alt="svg"
                      className="icon-topic"
                      height={12}
                      width={12}
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
                    value={asOfValues}
                    disabled={loadingIndicator}
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
                        className="!text-xs font-normal text-canBlack mb-2"
                        value={2}
                        onClick={() => handleRadioClick(2)}
                        id="default_input"
                      >
                        Default
                      </Radio>
                      <Radio
                        className="!text-xs !font-normal !text-canBlack"
                        value={1}
                        onClick={() => handleRadioClick(1)}
                        id="review_input"
                      >
                        Include review
                      </Radio>
                      <div className="flex justify-between items-center">
                        <Radio
                          className="text-xs font-normal text-canBlack"
                          value={3}
                          onClick={() => handleRadioClick(3)}
                          id="as_input"
                        >
                          Set Custom date
                        </Radio>
                        <div className="flex">
                          <DatePicker
                            disabled={
                              isDatePicker || selectedAsOf == "bydate"
                                ? false
                                : true
                            }
                            format="YYYY-MM-DD"
                            defaultValue={moment(current_date_filter * 1000)}
                            value={moment(selectedAsOFDate * 1000)}
                            suffixIcon={
                              <Image
                                src="/images/date-picker-icon.svg"
                                width={14}
                                height={14}
                              />
                            }
                            size={"large"}
                            className={`${styles.date} ${styles.dates} w-100 !text-canBlack text-xs`}
                            onChange={pickDate}
                            inputReadOnly={true}
                            disabledDate={(current) =>
                              current &&
                              current > moment(current_date_filter).endOf("day")
                            }
                            id="date_input"
                          />
                        </div>
                      </div>
                    </Space>
                  </Radio.Group>
                </Space>
              </div>
            </Col>
            {/* <Col xs={24}>
              {!openDrawer ? (
                <div className={styles.treeContainer + " !p-0"}>
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
              ) : null}
            </Col> */}
            <Col xs={24} className="refine-drawer-mobile overflow-hidden">
              <div className="flex items-center justify-start btn-parent fixed lg:static bottom-0 w-full lg:mt-14 lg:gap-5 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 lg:pt-0 pt-6">
                <PrimaryButton
                  className="flex justify-center items-center gap-2.5 w-6/12 lg:w-auto !rounded-none lg:!rounded-lg py-7 lg:py-0"
                  onClick={handleApplyClick}
                >
                  <span className="!flex gap-1 flex-row ">
                    <span>Apply</span>
                    {/* <span className="hidden lg:block">Filters</span> */}
                  </span>
                  <span className="!hidden lg:!flex  items-center">
                    <Image
                      src="/images/filterbtn-icon.svg"
                      alt="svg"
                      className="icon-topic "
                      height={16}
                      width={16}
                    />
                  </span>
                </PrimaryButton>
                <SecondaryButton
                  className="flex items-center justify-center gap-2.5 w-6/12 lg:w-auto !rounded-none lg:!rounded-lg border-[#d9d9d9] lg:border-canBlue py-7 lg:py-0"
                  onClick={onClose}
                >
                  Cancel
                  <span className="!hidden lg:!flex lg:items-center">
                    <Image
                      src="/images/refine-close-icon.svg"
                      alt="svg"
                      className="icon-topic "
                      height={16}
                      width={16}
                    />
                  </span>
                </SecondaryButton>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default FilterWithTree;
