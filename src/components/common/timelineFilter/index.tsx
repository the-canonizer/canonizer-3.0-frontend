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
      <div className="cn-algo-wrapper">
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
    </>
  );
};

export default CreateTopic;
