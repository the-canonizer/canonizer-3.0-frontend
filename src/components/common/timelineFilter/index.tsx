import React, { useEffect, useState } from "react";
import { Typography, Collapse, Select } from "antd";

import { RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

import styles from "./topicListFilter.module.scss";
import { setFilterCanonizedTopics } from "../../../store/slices/filtersSlice";
import { getCanonizedAlgorithmsApi } from "src/network/api/homePageApi";

/* eslint-disable */
const CreateTopic = ({ onCreateCamp = () => {} }: any) => {
  /* eslint-enable */

  const dispatch = useDispatch();

  const { algorithms, selectedAlgorithm, loading } = useSelector(
    (state: RootState) => ({
      algorithms: state.homePage?.algorithms,
      filteredScore: state?.filters?.filterObject?.filterByScore,
      selectedAlgorithm: state?.filters?.filterObject?.algorithm,
      loading: state?.loading?.loading,
    })
  );

  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (!(algorithms?.length > 0)) getCanonizedAlgorithmsApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectAlgorithm = (value) => {
    dispatch(
      setFilterCanonizedTopics({
        algorithm: value,
      })
    );
  };

  return (
    <>
      <div className="leftSideBar_Card cn-algo-wrapper">
        <div className={styles.algo_title}>
          <Title level={5} className="uppercase">
            Canonizer Algorithm:
          </Title>
          <Select
            size="large"
            showSearch
            optionFilterProp="children"
            className="algo-select"
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
        {/* <Collapse
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

            {/* <Paragraph className={styles.algoInfo}> */}
        {/* <i className="icon-fish-bones"></i> Algorithm Information */}
        {/* </Paragraph> */}
        {/* <div className={styles.filter}>
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
            </div> */}
        {/* </Panel> */}
        {/* </Collapse> */}
      </div>
    </>
  );
};

export default CreateTopic;
