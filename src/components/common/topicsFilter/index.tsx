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

const CreateTopic = () => {
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
    filterObject,
    loading,
    current_date_filter,
    viewThisVersion,
    campScoreValue,
  } = useSelector((state: RootState) => ({
    algorithms: state.homePage?.algorithms,
    filteredScore: state?.filters?.filterObject?.filterByScore,
    selectedAlgorithm: state?.filters?.filterObject?.algorithm,
    selectedAsOf: state?.filters?.filterObject?.asof,
    filteredAsOfDate: state?.filters?.filterObject?.asofdate,
    filterObject: state?.filters?.filterObject,
    loading: state?.loading?.loading,
    current_date_filter: state?.filters?.current_date,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    campScoreValue: state?.filters?.campWithScoreValue,
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
  useEffect(() => {
    if (didMount.current) {
      if (history.pushState) {
        const queryParams = `?score=${filterObject?.filterByScore}&algo=${
          filterObject?.algorithm
        }${
          filterObject?.asof == "bydate"
            ? "&asofdate=" + filterObject?.asofdate
            : ""
        }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${
          viewThisVersion ? "&viewversion=1" : ""
        }&filter=${campScoreValue || 10}`;
        var newurl =
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          queryParams;
        window.history.pushState({ path: newurl }, "", newurl);
      }
    } else {
      let aa = removeEmptyValues({
        filterByScore: `${router.query.score}` || `${filteredScore}` || "0",
        asofdate: +router.query.asofdate || filterObject?.asofdate,
        asof: router.query.asof || filterObject?.asof || "default",
        algorithm:
          router.query.algo || filterObject?.algorithm || "blind_popularity",
        namespace_id: +router.query.canon,
      });
      dispatch(setFilterCanonizedTopics(aa));
      didMount.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterObject]);

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
      <div className="leftSideBar_Card">
        <Collapse
          className={`${styles.cardAccordian} topicListFilterCardCollapse topicFilterBorderRemove`}
          expandIconPosition="right"
          expandIcon={() => (
            <div className={styles.collapseIcon}>
              <i className="icon-angle-up"></i>
            </div>
          )}
          bordered={false}
          defaultActiveKey={["1", "2", "3"]}
        >
          <Panel
            header={<span className={styles.title}>Canonizer</span>}
            key="1"
          >
            <div className={styles.algo_title}>
              <Title level={5} className={styles.algoText}>
                Canonizer Algorithm:
              </Title>
              <Popover content="Algorithm Information" placement="top">
                {router?.asPath.includes("/topic") ? (
                  <a href={K?.Network?.URL?.algoInfoUrl}>
                    Algorithm Information
                  </a>
                ) : (
                  <Link href={K?.Network?.URL?.algoInfoUrl}>
                    <a>Algorithm Information</a>
                  </Link>
                )}
              </Popover>
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
            <Paragraph className={styles.algoInfo}>
              {/* <i className="icon-fish-bones"></i> Algorithm Information */}
            </Paragraph>
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

            <div className={styles.scoreCheckbox}>
              <FullScoreCheckbox />
            </div>

            <div className={styles.scoreCheckbox}>
              <ArchivedCampCheckBox />
            </div>
          </Panel>
          <Panel
            className={`header-bg-color-change radio-group-sider ${selectedAsOf}`}
            header={
              <span className={styles.title}>
                As Of
                <Popover content={asContent} placement="right">
                  <i className="icon-info"></i>
                </Popover>
              </span>
            }
            key="2"
          >
            <Radio.Group onChange={onChange} value={value} disabled={loading}>
              <Space direction="vertical" style={{ gap: "12px" }}>
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
                  }}
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
            <DatePicker
              disabled={isDatePicker || selectedAsOf == "bydate" ? false : true}
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
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default CreateTopic;
