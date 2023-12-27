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
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setIsReviewCanonizedTopics } from "../../../store/slices/filtersSlice";
import Link from "next/link";
import { useCookies } from "react-cookie";

import { setViewThisVersion } from "src/store/slices/filtersSlice";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { useRouter } from "next/router";
import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
import K from "../../../constants";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
import FullScoreCheckbox from "../../ComponentPages/FullScoreCheckbox";
import ArchivedCampCheckBox from "src/components/ComponentPages/ArchivedCampCheckBox";
import CampTreeCard from "src/components/ComponentPages/TopicDetails/CampTreeCard";
import { replaceSpecialCharacters } from "src/utils/generalUtility";

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
  isForumPage = false,
}: any) => {
  const [isDatePicker, setIsDatePicker] = useState(false);

  const [datePickerValue, setDatePickerValue] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // eslint-disable-next-line no-unused-vars
  const [cookie, setCookie] = useCookies(["canAlgo", "asof", "asofDate"]);

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
    topicRecord,
    campRecord,
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
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
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
  const didMount2 = useRef(false);
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
    viewversion = viewThisVersion,
    campCheck = false
  ) => {
    console.log("asasasasasasas ", campCheck);
    let query: any = {
      score: filterByScore,
      algo: algorithm,
      canon: namespace_id,
      asof: asof,
      filter: campScoreValue || "10",
    };
    if (campCheck) {
      query.camp = [
        `${topicRecord?.topic_num}-${replaceSpecialCharacters(
          topicRecord?.topic_name,
          "-"
        )}`,
        `${
          campRecord?.camp_num
            ? `${campRecord?.camp_num}-${replaceSpecialCharacters(
                campRecord?.camp_name,
                "-"
              )}`
            : "1-Agreement"
        }`,
      ];
    }

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

    if (asof === "default") {
      delete router.query.asof;
    }

    if (algorithm === "blind_popularity") {
      delete router.query.algo;
    }

    if (String(campScoreValue) === "10") {
      delete router.query.filter;
    }

    if (
      router?.query?.filter === "undefined" ||
      router?.query?.filter === undefined ||
      router?.query?.filter === "null" ||
      router?.query?.filter === null
    ) {
      delete router.query.filter;
    }

    router.replace(router, null, { shallow: true });
  };

  useEffect(() => {
    if (
      (String(filterObject?.filterByScore) !== "0" ||
        String(filterObject?.namespace_id) !== "1" ||
        filterObject?.asof !== "default" ||
        filterObject?.algorithm !== "blind_popularity" ||
        campScoreValue !== 10) &&
      !didMount2.current
    ) {
      console.log(
        "sadad 1= >  ",
        `${topicRecord?.topic_num}-${replaceSpecialCharacters(
          topicRecord?.topic_name,
          "-"
        )}`,
        `${
          campRecord?.camp_num
            ? `${campRecord?.camp_num}-${replaceSpecialCharacters(
                campRecord?.camp_name,
                "-"
              )}`
            : "1-Agreement"
        }`
      );
      onChangeRoute(
        filterObject?.filterByScore,
        filterObject?.algorithm,
        filterObject?.asof,
        filterObject?.asofdate,
        filterObject?.namespace_id,
        viewThisVersion,
        false
      );
    } else if (didMount2.current) {
      console.log(
        "sadad 1= >  ",
        `${topicRecord?.topic_num}-${replaceSpecialCharacters(
          topicRecord?.topic_name,
          "-"
        )}`,
        `${
          campRecord?.camp_num
            ? `${campRecord?.camp_num}-${replaceSpecialCharacters(
                campRecord?.camp_name,
                "-"
              )}`
            : "1-Agreement"
        }`
      );
      onChangeRoute(
        filterObject?.filterByScore,
        filterObject?.algorithm,
        filterObject?.asof,
        filterObject?.asofdate,
        filterObject?.namespace_id,
        viewThisVersion,
        true
      );
    }
    didMount2.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campRecord]);

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
    getCanonizedAlgorithmsApi();
  }, []);

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

  return (
    <>
      <div className="leftSideBar_Card drawer_card">
        <Collapse
          className={`${styles.cardAccordian} ${styles.cardWithDrawerAccordian} topicListFilterCardCollapse`}
          expandIconPosition="right"
          bordered={false}
          defaultActiveKey={["1"]}
        >
          <Panel
            className={`header-bg-color-change radio-group-sider ${selectedAsOf}`}
            header={null}
            key="1"
          >
            <Row gutter={20} className={styles.filterRow}>
              <Col xs={12}>
                <div className={styles.algo_title}>
                  <Title level={5} className={styles.algoText}>
                    Canonizer Algorithm:{"  "}
                    <Popover
                      content="Algorithm Information"
                      placement="top"
                      className={styles.algoInfoIcon}
                    >
                      {router?.asPath.includes("/topic") ? (
                        <a href={K?.Network?.URL?.algoInfoUrl}>
                          <i className="icon-info"></i>
                        </a>
                      ) : (
                        <Link href={K?.Network?.URL?.algoInfoUrl}>
                          <a>
                            <i className="icon-info"></i>
                          </a>
                        </Link>
                      )}
                    </Popover>
                  </Title>
                </div>
                <Select
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  className={styles.algoSelect}
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
                  disabled={loading}
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
              </Col>
              <Col
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <div className={styles.filter}>
                  <Text className={styles.filterText}>Filter</Text>
                  <LeftOutlined className={styles.LeftOutlined} />
                  <Input
                    size="large"
                    onChange={filterOnScore}
                    value={inputValue}
                    disabled={loading}
                    id="filter_input"
                  />
                  <Popover
                    content={infoContent}
                    placement="right"
                    className={styles.infoIcon}
                  >
                    <i className="icon-info"></i>
                  </Popover>
                </div>
              </Col>
              <Col md={24}>
                <div className={styles.scoreCheckbox}>
                  <FullScoreCheckbox />
                </div>
                <ArchivedCampCheckBox />
              </Col>
              <Col md={24}>
                <div className={`${styles.algo_title} ${styles.title}`}>
                  <Title level={5} className={styles.algoText}>
                    As Of
                    <Popover content={asContent} placement="right">
                      <i className="icon-info"></i>
                    </Popover>
                  </Title>
                </div>
                <Space
                  direction="horizontal"
                  style={{ gap: "12px", width: "100%" }}
                  className={styles.radioInputs}
                >
                  <Radio.Group
                    onChange={onChange}
                    value={value}
                    disabled={loading}
                    className={styles.radioBtns}
                    id="radio_group"
                  >
                    <Space direction="horizontal" style={{ gap: "12px" }}>
                      <Radio
                        className={styles.radio + " topicFilterRadio"}
                        value={1}
                        onClick={() => {
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
                        }}
                        id="review_input"
                      >
                        Include review
                      </Radio>
                      <Radio
                        className={styles.radio + " topicFilterRadio"}
                        value={2}
                        onClick={() => {
                          dispatch(setViewThisVersion(false));
                          setCookie("asof", "default", {
                            path: "/",
                          });
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
                        id="default_input"
                      >
                        Default
                      </Radio>
                      <Radio
                        className={styles.radio + " topicFilterRadio"}
                        value={3}
                        onClick={() => {
                          dispatch(setViewThisVersion(false));
                          handleAsOfClick();
                        }}
                        id="as_input"
                      >
                        As of date
                      </Radio>
                    </Space>
                  </Radio.Group>
                  <div className="d-flex">
                    <DatePicker
                      disabled={
                        isDatePicker || selectedAsOf == "bydate" ? false : true
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
                    <Popover
                      content={""}
                      placement="right"
                      className={styles.infoIcon}
                    >
                      <i
                        className="icon-info"
                        style={{ visibility: "hidden", width: "40px" }}
                      ></i>
                    </Popover>
                  </div>
                </Space>
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
            </Row>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default FilterWithTree;
