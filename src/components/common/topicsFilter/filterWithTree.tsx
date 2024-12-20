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
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

import styles from "./topicListFilter.module.scss";

import { RootState } from "src/store";
import { setIsReviewCanonizedTopics } from "src/store/slices/filtersSlice";
import {
  setViewThisVersion,
  setFilterCanonizedTopics,
} from "src/store/slices/filtersSlice";
import K from "src/constants";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import { getTreesApi } from "src/network/api/campDetailApi";
import {
  setOpenDrawer,
  setAsOfValues,
  setClearAlgoFromRefineFilter,
  setClearScoreFromRefineFilter,
  setDisbaleApplyBtn,
} from "src/store/slices/campDetailSlice";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import RefineIcon from "components/ComponentPages/TopicDetails/CampInfoBar/refineIcon";
import { setOpenConsensusTreePopup } from "src/store/slices/hotTopicSlice";
import useAuthentication from "src/hooks/isUserAuthenticated";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

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

const FilterWithTree = ({ loadingIndicator }: any) => {
  const [isDatePicker, setIsDatePicker] = useState(false);

  const [datePickerValue, setDatePickerValue] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const { isUserAuthenticated } = useAuthentication();

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
    disbaleApplyBtn,
    userEmail,
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
    disbaleApplyBtn: state.topicDetails.disbaleApplyBtn,
    userEmail: state?.auth?.loggedInUser?.email,
  }));

  const [selectedAsOFDate, setSelectedAsOFDate] = useState(filteredAsOfDate);
  const [timer, setTimer] = useState(null);
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
      // setSelectAlgo("blind_popularity");
      dispatch(setClearAlgoFromRefineFilter("blind_popularity"));
      if (!router?.query?.score) {
        dispatch(setClearScoreFromRefineFilter(0));
      }
      if (router?.query?.asof !== "bydate" || !router?.query?.asofdate) {
        handleRadioClick(2);
      }
    } else {
      dispatch(setClearAlgoFromRefineFilter(router?.query?.algo));
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
    setSelectedAsOFDate(filteredAsOfDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAsOfDate]);

  useEffect(() => {
    if (!(algorithms?.length > 0)) getCanonizedAlgorithmsApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check the router query parameter and set the default value
    if (router.query.asof === "bydate") {
      dispatch(setAsOfValues(3));
      setIsDatePicker(true);
    } else if (router.query.asof === "review") {
      dispatch(setAsOfValues(1));
    } else {
      dispatch(setAsOfValues(2));
      // Default radio button
      setIsDatePicker(false);
    }
  }, [router.query.asof]);

  const reqBodyForService = {
    topic_num: router?.query?.camp[0]?.split("-")[0],
    camp_num: router?.query?.camp[1]?.split("-")[0] ?? 1,
    asOf: asof,
    asofdate:
      asof == "default" || asof == "review" ? Date.now() / 1000 : asofdate,
    algorithm: clearAlgoFromRefineFilter,
    update_all: 1,
    fetch_topic_history: viewThisVersionCheck ? 1 : null,
    current_user: isUserAuthenticated ? userEmail : "",
  };

  const revertScore = async () => {
    await getTreesApi(reqBodyForService);
  };

  const selectAlgorithm = async (value) => {
    setCookie("canAlgo", value, {
      path: "/",
    });
    dispatch(
      setFilterCanonizedTopics({
        algorithm: clearAlgoFromRefineFilter,
      })
    );

    await revertScore();
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

  const updateURLWithAlgo = (selectedAlgorithm) => {
    const currentQuery = router.query;

    // Update the query params
    const newQuery = {
      ...currentQuery, // Retain the existing query parameters
      algo: selectedAlgorithm, // Update with the selected algorithm
    };

    // Push the new URL without causing a full page reload
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleApplyClick = async () => {
    dispatch(setDisbaleApplyBtn(true));
    const selectedAlgorithm = clearAlgoFromRefineFilter;

    // Step 1: Update URL with the selected algorithm
    updateURLWithAlgo(selectedAlgorithm);

    // Step 2: Dispatch Redux actions and perform state updates
    dispatch(setOpenDrawer(false));
    filterOnScore(clearScoreFromRefineFilter);
    await selectAlgorithm(clearAlgoFromRefineFilter);
    // Step 3: Handle different cases based on selectedValue
    if (selectedValue === 2) {
      delete router?.query?.viewversion;
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
      setCookie("asof", "review", { path: "/" });

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
    } else if (selectedValue === 3 || asof === "bydate") {
      setSelectedValue(3);
      dispatch(setViewThisVersion(false));
      handleAsOfClick();
    }
  };

  const onClose = () => {
    dispatch(setOpenDrawer(false));
  };

  const handleChange = (event) => {
    const value = event?.target?.value;

    // Check if the value length is manageable within JavaScript's safe range
    if (value.length <= 15) {
      // Convert to number if it's within a safe range
      dispatch(setClearScoreFromRefineFilter(Number(value)));
    } else {
      // Otherwise, store it as a string to avoid `Infinity`
      dispatch(setClearScoreFromRefineFilter(value));
    }
  };
  const handleChangeAlgo = (algo) => {
    dispatch(setClearAlgoFromRefineFilter(algo));

    const { query } = router;
    // Update the URL with the new algorithm
    router.push({
      pathname: router.pathname,
      query: { ...query, algo },
    });
  };

  return (
    <div className="leftSideBar_Card drawer_card" id="refine_filter_section">
      <div
        id="refine_filter_section_topicListFilterCardCollapse"
        className={`${styles.cardAccordian} ${styles.cardWithDrawerAccordian} topicListFilterCardCollapse`}
      >
        <div
          id="refine_filter_section_radio_group_sider"
          className={`header-bg-color-change radio-group-sider ${selectedAsOf}`}
          key="1"
        >
          <Row gutter={20} id="refine_filter_section_row_1">
            <Col xs={24} id="refine_filter_section_row_col">
              <div
                className="algo_title_new border-b lg:border-canGrey2 border-canLightgrey4 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 lg:pt-0 pt-6 "
                id="refine_filter_section_algorith_section"
              >
                <Title
                  id="refine_filter_section_algorith_titte_tag"
                  level={5}
                  className="!text-xs !font-normal flex gap-1 !mb-2"
                >
                  Select Canonizer Algorithm
                  <Popover
                    id="refine_filter_section_algorith_popover"
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
                          id="refine_filter_section_algorith_circle_img"
                          src="/images/circle-info-bread.svg"
                          alt="svg"
                          className="icon-topic"
                          height={12}
                          width={12}
                        />
                      </a>
                    ) : (
                      <Link
                        href={K?.Network?.URL?.algoInfoUrl}
                        id="refine_filter_section_algorith_info_url"
                      >
                        <a>
                          <Image
                            id="refine_filter_section_algorith_info_ur_circle_img"
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
                  id="refine_filter_section_algorith_select_tag"
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
              className="flex justify-center items-end"
              xs={24}
              id="refine_filter_section_score_value_col"
            >
              <div
                className="score_value pr-4 lg:pr-8  pl-4 lg:pl-8 pb-8 pt-8 w-full border-b lg:border-canGrey2 border-canLightgrey4 "
                id="refine_filter_section_score_value_div"
              >
                <Text
                  className={`${styles.filterText} !mb-0`}
                  id="refine_filter_section_score_value_text_tag"
                >
                  <p
                    className="flex items-center gap-1 text-xs font-normal !mb-2"
                    id="refine_filter_section_score_value_text"
                  >
                    Score value
                    <Popover
                      id="refine_filter_section_score_value_pop_over"
                      content={infoContent}
                      placement="right"
                      className={styles.infoIcon}
                    >
                      <Image
                        id="refine_filter_section_score_value_popover_circle_img"
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
                  type="text"
                  size="large"
                  className="rounded-lg lg:!w-4/5 w-full text-sm text-canBlack font-medium"
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numeric values
                    if (!isNaN(Number(value))) {
                      handleChange(e); // Call your handleChange function
                    }
                  }}
                  value={clearScoreFromRefineFilter}
                  disabled={loadingIndicator}
                  id="filter_input"
                  prefix={
                    <span className="text-canLight text-sm font-medium">
                      Greater than -
                    </span>
                  }
                  onKeyPress={(e) => {
                    // Prevent any non-numeric input
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </Col>
            <Col xs={24} className="" id="refine_filter_section_as_of_col">
              <div
                className="as-of-div pl-4 lg:pl-8 pb-8 pt-8 w-full"
                id="refine_filter_section_as_of_col_div"
              >
                <Title
                  id="refine_filter_section_as_of_title_tag"
                  level={5}
                  className="!text-xs !font-normal flex gap-3 !mb-4"
                >
                  As Of
                  <Popover
                    content={asContent}
                    placement="right"
                    id="refine_filter_section_as_of_popover"
                  >
                    <Image
                      id="refine_filter_section_as_of_circle_img"
                      src="/images/circle-info-bread.svg"
                      alt="svg"
                      className="icon-topic"
                      height={12}
                      width={12}
                    />
                  </Popover>
                </Title>
                <Space
                  id="refine_filter_section_as_of_space_tag"
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
                      id="refine_filter_section_as_of_space"
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
                            allowClear={false}
                          />
                        </div>
                      </div>
                    </Space>
                  </Radio.Group>
                </Space>
              </div>
            </Col>
            <Col
              xs={24}
              className="refine-drawer-mobile overflow-hidden"
              id="refine_filter_section_btn_section"
            >
              <div
                className="flex items-center justify-start btn-parent fixed lg:static bottom-0 w-full lg:mt-14 lg:gap-5 pr-4 lg:pr-8 pl-4 lg:pl-8 pb-8 lg:pt-0 pt-6"
                id="refine_filter_section_btn_section_div"
              >
                <PrimaryButton
                  className="flex justify-center items-center gap-2.5 w-6/12 lg:w-auto !rounded-none lg:!rounded-lg py-7 lg:py-0"
                  onClick={handleApplyClick}
                  disabled={disbaleApplyBtn}
                >
                  <span
                    className="!flex gap-1 flex-row "
                    id="refine_filter_section_btn_apply"
                  >
                    <span id="apply_btn">Apply</span>
                  </span>
                  <span
                    className="!hidden lg:!flex  items-center"
                    id="refine_filter_section_refine_icon"
                  >
                    <RefineIcon className="w-[16px] [&>svg]:fill-white" />
                  </span>
                </PrimaryButton>
                <SecondaryButton
                  id="refine_filter_section_seceondry_btn_section"
                  className="flex items-center justify-center gap-2.5 w-6/12 lg:w-auto !rounded-none lg:!rounded-lg border-[#d9d9d9] lg:border-canBlue py-7 lg:py-0"
                  onClick={onClose}
                >
                  Cancel
                  <span
                    className="!hidden lg:!flex lg:items-center mr-2"
                    id="refine_filter_section_seceondry_btn_img"
                  >
                    <Image
                      id="refine_filter_section_seceondry_btn_img_close_icon"
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
