import { Dropdown, Select } from "antd";
import Image from "next/image";
import { SortDescendingOutlined } from "@ant-design/icons";
import SortActiveTopicIcon from "../../../assets/image/sort-active-ico.svg";
import SortTopicIcon from "../../../assets/image/sort-ico.svg";
import styles from "../../ComponentPages/SortingTopics/sort.module.scss";
import {
  setScoreViewTopic,
  setSortLatestTopic,
} from "src/store/slices/utilsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SortTopics = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // State from Redux
  const { sortLatestTopic, sortScoreViewTopic } = useSelector(
    (state: RootState) => ({
      sortLatestTopic: state.utils.sortLatestTopic,
      sortScoreViewTopic: state.utils.sortScoreViewTopic,
    })
  );

  // Reset sorting options when navigating to the home page
  useEffect(() => {
    if (router.pathname === "/") {
      dispatch(setScoreViewTopic(false));
      dispatch(setSortLatestTopic(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  // Handlers for selecting sorting options
  const handleLatestTopic = () => {
    dispatch(setSortLatestTopic(true));
    dispatch(setScoreViewTopic(false));
  };

  const handleScoreViewTopic = () => {
    dispatch(setScoreViewTopic(true));
    dispatch(setSortLatestTopic(false));
  };

  return (
    <div className={styles.sortContainer}>
      {/* Select component for sorting */}
      <Select
        size="large"
        className="browse-filters"
        suffixIcon={<i className="icon-sort"></i>}
        style={{ width: 150 }}
        placeholder="Sort By"
        value={
          sortLatestTopic
            ? "Latest"
            : sortScoreViewTopic
            ? "ScoreValue"
            : "ScoreValue"
        }
        onChange={(value) => {
          if (value === "Latest") {
            handleLatestTopic();
          } else if (value === "ScoreValue") {
            handleScoreViewTopic();
          }
        }}
      >
        <Select.Option value="Latest">Latest</Select.Option>
        <Select.Option value="ScoreValue">Score Value</Select.Option>
      </Select>
    </div>
  );
};

export default SortTopics;
