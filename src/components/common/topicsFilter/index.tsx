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
import styles from "./createTopic.module.scss";
import { LeftOutlined } from "@ant-design/icons";
import { getCanonizedTopicsApi } from "../../../network/api/homePageApi";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { setCanonizedTopics } from "../../../store/slices/homePageSlice";

const { Title, Text, Paragraph, Link } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const mockDropdownList = ["blind_popularity", "mind_experts"];

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
  const [nameSpace, setNameSpace] = useState("/General/");
  const dispatch = useDispatch();
  const canonizedTopics = useSelector(
    (state: RootState) => state.homePage?.canonizedTopics
  );

  const selectAlgorithm = (value) => {
    debugger;
    const reqBody = {
      page_number: 1,
      page_size: 20,
      namespace_id: 1,
      asofdate: 1642464000,
      algorithm: value,
      search: "Hard",
    };
    setNameSpace(value);
    getCanonizedTopicsApi();
  };

  const filterOnScore = (e) => {
    console.log("filterOnScore", e.target.value);
    const filteredTopics = canonizedTopics?.data?.topic?.filter(
      (topic) => topic.topic_score < +e.target.value
    );
    debugger;
    dispatch(
      setCanonizedTopics({
        ...canonizedTopics,
        data: {
          topic: filteredTopics,
        },
      })
    );
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
                defaultValue="0.0014"
                onChange={filterOnScore}
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
            <Radio.Group>
              <Space direction="vertical">
                <Radio className={styles.radio} value={1}>
                  Include review
                </Radio>
                <Radio className={styles.radio} value={2}>
                  Default
                </Radio>
                <Radio className={styles.radio} value={3}>
                  As of date
                </Radio>
              </Space>
            </Radio.Group>
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }}
              suffixIcon={<i className="icon-calendar"></i>}
              size={"large"}
              className={styles.date}
            />
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default CreateTopic;
