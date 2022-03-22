import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Typography,
  Button,
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
import {
  setIsReviewCanonizedTopics,
  setFilterCanonizedTopics,
} from "../../../store/slices/homePageSlice";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { useRouter } from "next/router";

const infoContent = (
  <>
    <div className={styles.infoText}>
      <Title level={5}>Score Value </Title>
      <p>
        Duis aute irure dolor in reprehderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur.
      </p>
    </div>
  </>
);

const asContent = (
  <>
    <div className={styles.asfoText}>
      <Title level={5}>Include review</Title>
      <Paragraph>
        Duis aute irure dolor in reprehderit in voluptalore eu fugiat nulla
        pariatur.
      </Paragraph>
      <Title level={5}>Default</Title>
      <Paragraph>
        Duis aute irure dolor in reprehderit in voluptalore eu fugiat nulla
        pariatur.
      </Paragraph>
      <Title level={5}>As of date</Title>
      <Paragraph>
        Duis aute irure dolor in reprehderit in voluptalore eu fugiat nulla
        pariatur.
      </Paragraph>
    </div>
  </>
);

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

const CreateTopic = () => {
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [value, setValue] = useState(2);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [inputFilterValue, setInputFilterValue] = useState(0.0);
  const dispatch = useDispatch();
  const router = useRouter();

  const { algorithms, filterObject } = useSelector((state: RootState) => ({
    algorithms: state.homePage?.algorithms,
    filterObject: state.homePage.filterObject,
  }));

  useEffect(() => {
    if (history.pushState) {
      const queryParams = `?filter=${filterObject?.filterByScore}&algorithm=${filterObject?.algorithm}&asofdate=${filterObject?.asofdate}&namespace=${filterObject?.nameSpace}`;
      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        queryParams;
      window.history.pushState({ path: newurl }, "", newurl);
    }
  }, [filterObject]);

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
    const IsoDateFormat = Date.parse(e?._d) / 1000;
    setDatePickerValue(e?._d);
    dispatch(
      setFilterCanonizedTopics({
        asofdate: IsoDateFormat,
        asof: "bydate",
      })
    );
  };

  const filterOnScore = (e) => {
    const { value } = e.target;

    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      setInputFilterValue(value);
      dispatch(
        setFilterCanonizedTopics({
          filterByScore: value,
        })
      );
    }
  };

  const handleAsOfClick = () => {
    if (datePickerValue !== null) {
      dispatch(
        setFilterCanonizedTopics({
          asofdate: Date.parse(datePickerValue) / 1000,
          asof: "bydate",
        })
      );
    }
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.btnsWrap}>
          <Button size="large" className={styles.btn}>
            <i className="icon-topic"></i> Create New Topic
          </Button>
        </div>
        <Collapse
          className={`${styles.cardAccordian} topicListFilterCardCollapse`}
          expandIconPosition="right"
          expandIcon={() => (
            <div className={styles.collapseIcon}>
              <i className="icon-angle-up"></i>
            </div>
          )}
          bordered={false}
          defaultActiveKey={["1"]}
        >
          <Panel
            header={<span className={styles.title}>Canonizer</span>}
            key="1"
          >
            <Title level={5} className={styles.algoText}>
              Canonizer Algorithm:
            </Title>
            <Select
              size="large"
              className={styles.algoSelect}
              defaultValue={algorithms && algorithms[0]?.algorithm_label}
              onChange={selectAlgorithm}
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
              <i className="icon-fish-bones"></i> Algorithm Information
            </Paragraph>
            <div className={styles.filter}>
              <Text>Filter</Text>
              <LeftOutlined className={styles.LeftOutlined} />
              <Input
                size="large"
                onChange={filterOnScore}
                value={inputFilterValue}
              />
              <Popover content={infoContent} placement="right">
                <i className="icon-info"></i>
              </Popover>
            </div>
          </Panel>
          <Panel
            header={
              <span className={styles.title}>
                As of
                <Popover content={asContent} placement="right">
                  <i className="icon-info"></i>
                </Popover>
              </span>
            }
            key="2"
          >
            <Radio.Group onChange={onChange} value={value}>
              <Space direction="vertical">
                <Radio
                  className={styles.radio}
                  value={1}
                  onClick={() => {
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
                  className={styles.radio}
                  value={2}
                  onClick={() => {
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
                  className={styles.radio}
                  value={3}
                  onClick={() => {
                    handleAsOfClick();
                  }}
                >
                  As of date
                </Radio>
              </Space>
            </Radio.Group>
            <DatePicker
              // open={isDatePicker}
              disabled={!isDatePicker}
              format="YYYY-MM-DD"
              // defaultValue={datePickerValue}
              // disabledDate={disabledDate}
              // disabledTime={disabledDateTime}
              // showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
              suffixIcon={<i className="icon-calendar"></i>}
              size={"large"}
              className={`${styles.date} w-100`}
              onChange={pickDate}
              inputReadOnly={true}
            />
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default CreateTopic;
