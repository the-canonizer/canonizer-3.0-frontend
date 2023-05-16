import React, { useEffect, useState } from "react";
import { Typography, Collapse, Select, Input, Popover } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { useRouter } from "next/router";
import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";
// import { showCreateCampButton } from "src/utils/generalUtility";

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

// const asContent = (
//   <>
//     <div className={styles.asfoText}>
//       <Title level={5}>Include review</Title>
//       <Paragraph>
//         In addition to the published camps, this option shows camps in Review.
//       </Paragraph>
//       <Title level={5}>Default</Title>
//       <Paragraph>
//         This option lists down the latest (current date) version of camps.
//       </Paragraph>
//       <Title level={5}>As of date</Title>
//       <Paragraph>
//         This option shows the historical view of camps according to the selected
//         date.
//       </Paragraph>
//     </div>
//   </>
// );

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

const CreateTopic = () => {
  // const isAuth = useAuthentication();

  // const [isDatePicker, setIsDatePicker] = useState(false);
  // const [isPanelCollapse, setIsPanelCollapse] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  // const [isCampBtnVisible, setIsCampBtnVisible] = useState(false);

  const { algorithms, filteredScore, selectedAlgorithm, loading } = useSelector(
    (state: RootState) => ({
      algorithms: state.homePage?.algorithms,
      filteredScore: state?.filters?.filterObject?.filterByScore,
      selectedAlgorithm: state?.filters?.filterObject?.algorithm,
      loading: state?.loading?.loading,
    })
  );

  const [timer, setTimer] = useState(null);
  const [inputValue, setInputValue] = useState(filteredScore);
  const [isLoading, setIsLoading] = useState(loading);

  // /////////////////////////////////////////////////////////////////////////
  // Discussion required on this functionality after that I will remove or //
  //                        uncomment bellow code                         //
  // //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    setIsLoading(loading);
  }, [isLoading]);

  useEffect(() => {
    if (router.pathname.includes("/topic/")) {
      // setIsPanelCollapse(true);
      // setIsCampBtnVisible(true);
    }
  }, [router.pathname]);

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

  return (
    <>
      <div className="leftSideBar_Card">
        {/* <div className="btnsWrap">
         
        </div> */}
        <Collapse
          className={`${styles.cardAccordian} topicListFilterCardCollapse`}
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
            </div>

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
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export default CreateTopic;
