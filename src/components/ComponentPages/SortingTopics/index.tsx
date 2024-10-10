import { Select } from "antd";
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
      sortLatestTopic: state?.utils?.sortLatestTopic,
      sortScoreViewTopic: state?.utils?.sortScoreViewTopic,
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
    <div className={`browse-sort ${styles.sortContainer}`}>
      {/* Select component for sorting */}
      <Select
        size="large"
        className="browse-filters text-canBlack font-normal commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack"
        suffixIcon={<i className="icon-sort"></i>}
        placeholder="Sort By"
        value={sortLatestTopic ? "Latest" : "ScoreValue"}
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
