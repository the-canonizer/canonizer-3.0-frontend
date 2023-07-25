import React, { useEffect, useState } from "react";
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

import { setViewThisVersion } from "src/store/slices/filtersSlice";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { useRouter } from "next/router";
import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
import K from "../../../constants";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
// import { showCreateCampButton } from "src/utils/generalUtility";
import FullScoreCheckbox from "../../ComponentPages/FullScoreCheckbox";
import useAuthentication from "src/hooks/isUserAuthenticated";
import ArchivedCampCheckBox from "src/components/ComponentPages/ArchivedCampCheckBox";
import CampTreeCard from "src/components/ComponentPages/TopicDetails/CampTreeCard";

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

// function range(start, end) {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// }

// function disabledDate(current) {
//   // Can not select days before today and today
//   return current && current < moment().endOf("day");
// }

// function disabledDateTime() {
//   return {
//     disabledHours: () => range(0, 24).splice(4, 20),
//     disabledMinutes: () => range(30, 60),
//     disabledSeconds: () => [55, 56],
//   };
// }

const FilterWithTree = ({
  onCreateCamp = () => {},
  getTreeLoadingIndicator,
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  backGroundColorClass,
}: any) => {
  const isAuth = useAuthentication();

  const [isDatePicker, setIsDatePicker] = useState(false);
  // const [isPanelCollapse, setIsPanelCollapse] = useState(false);

  const [datePickerValue, setDatePickerValue] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();
  const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);

  const campRoute = () => {
    router?.push("/create/topic");
  };

  const {
    algorithms,
    filteredScore,
    selectedAlgorithm,
    selectedAsOf,
    filteredAsOfDate,
    currentCampNode,
    tree,
    loading,
    current_date_filter,
    campExist,
  } = useSelector((state: RootState) => ({
    algorithms: state.homePage?.algorithms,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    selectedAsOf: state?.filters?.filterObject?.asof,
    filteredAsOfDate: state?.filters?.filterObject?.asofdate,
    currentCampNode: state?.filters?.selectedCampNode,
    tree: state?.topicDetails?.tree && state?.topicDetails?.tree[0],
    loading: state?.loading?.loading,
    current_date_filter: state?.filters?.current_date,
    campExist: state?.topicDetails?.tree && state?.topicDetails?.tree[1],
  }));
  const { campRecord } = useSelector((state: RootState) => ({
    campRecord: state?.topicDetails?.currentCampRecord,
  }));
  const [value, setValue] = useState(
    selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3
  );
  const [selectedAsOFDate, setSelectedAsOFDate] = useState(filteredAsOfDate);
  const [timer, setTimer] = useState(null);
  const [inputValue, setInputValue] = useState(filteredScore);
  const [isLoading, setIsLoading] = useState(loading);

  // /////////////////////////////////////////////////////////////////////////
  // Discussion required on this functionality after that I will remove or //
  //                        uncomment bellow code                         //
  // //////////////////////////////////////////////////////////////////////

  // useEffect(() => {
  //   if (didMount.current) {
  //     if (history.pushState) {
  //       const queryParams = `?filter=${filterObject?.filterByScore}&algorithm=${filterObject?.algorithm}&asofdate=${filterObject?.asofdate}&canon=${filterObject?.namespace_id}`;
  //       var newurl =
  //         window.location.protocol +
  //         "//" +
  //         window.location.host +
  //         window.location.pathname +
  //         queryParams;
  //       window.history.pushState({ path: newurl }, "", newurl);
  //     }
  //   } else didMount.current = true;
  // }, [filterObject]);

  useEffect(() => {
    setIsLoading(loading);
  }, [isLoading]);

  useEffect(() => {
    setValue(selectedAsOf == "default" ? 2 : selectedAsOf == "review" ? 1 : 3);
  }, [selectedAsOf]);

  useEffect(() => {
    if (router?.pathname.includes("/topic/")) {
      // setIsPanelCollapse(true);
      setIsCampBtnVisible(true);
    }
  }, [router?.pathname]);

  useEffect(() => {
    setSelectedAsOFDate(filteredAsOfDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredAsOfDate]);

  useEffect(() => {
    getCanonizedAlgorithmsApi();
  }, []);

  const selectAlgorithm = (value) => {
    dispatch(
      setFilterCanonizedTopics({
        algorithm: value,
      })
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

    dispatch(
      setFilterCanonizedTopics({
        asofdate: IsoDateFormat,
        asof: "bydate",
      })
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
      dispatch(
        setFilterCanonizedTopics({
          asofdate: Date.parse(dateValue) / 1000,
          asof: "bydate",
        })
      );
    } else {
      dispatch(
        setFilterCanonizedTopics({
          asofdate: Date.now() / 1000,
          asof: "bydate",
        })
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
                >
                  {algorithms?.map((algo) => {
                    return (
                      <Option key={algo.id} value={algo.algorithm_key}>
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
                  >
                    <Space direction="horizontal" style={{ gap: "12px" }}>
                      <Radio
                        className={styles.radio + " topicFilterRadio"}
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
                        }}
                      >
                        Include review
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
                        }}
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
