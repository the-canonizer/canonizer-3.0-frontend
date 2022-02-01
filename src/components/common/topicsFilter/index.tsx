import React, { useState } from "react";
import moment from "moment";
import {
  Typography,
  Button,
  Divider,
  Collapse,
  Select,
  Radio,
  Space,
  Input,
  DatePicker,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";

import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  setCanonizedTopics,
  setFilterCanonizedTopics,
} from "../../../store/slices/homePageSlice";

import styles from "./createTopic.module.scss";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const mockDropdownList = ["blind_popularity", "mind_experts"];

const infoContent = (
  <>
    <div className={styles.infoText}>
      <Title level={5}>Score Value FIlter</Title>
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
  const [inputFilterValue, setInputFilterValue] = useState(0.0);
  const dispatch = useDispatch();

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
    const IsoDateFormat = Date.parse(e._d);
    dispatch(
      setFilterCanonizedTopics({
        asofdate: IsoDateFormat,
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

  return (
    <>
      <div className={styles.wrap}>
        <Button size="large" className={styles.createBtn}>
          <i className="icon-topic"></i>Create New Topic
        </Button>
        <Divider className={styles.divider} />
        <Collapse
          className={styles.accordian}
          expandIconPosition="right"
          expandIcon={() => (
            <div className={styles.IconAngle}>
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
              defaultValue={mockDropdownList[0]}
              onChange={selectAlgorithm}
            >
              {mockDropdownList.map((item) => {
                return (
                  <Option key={item} value={item}>
                    {item}
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
              <i className="icon-info"></i>
            </div>
          </Panel>
          <Panel
            header={
              <span className={styles.title}>
                As of <i className="icon-info"></i>
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
                      setFilterCanonizedTopics({
                        asofdate: "review",
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
                        asofdate: "default",
                      })
                    );
                  }}
                >
                  Default
                </Radio>
                <Radio className={styles.radio} value={3}>
                  As of date
                </Radio>
              </Space>
            </Radio.Group>
            <DatePicker
              // open={isDatePicker}
              disabled={!isDatePicker}
              format="YYYY-MM-DD"
              // disabledDate={disabledDate}
              // disabledTime={disabledDateTime}
              // showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
              suffixIcon={<i className="icon-calendar"></i>}
              size={"large"}
              className={styles.date}
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
