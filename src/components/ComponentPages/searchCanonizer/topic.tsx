import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
// import AdvanceFilter from "../../common/AdvanceSearchFilter";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Empty, Pagination } from "antd";

const TopicSearch = () => {
  const { searchData } = useSelector((state: RootState) => ({
    searchData: state?.searchSlice?.searchData,
  }));
  const [startingPosition, setStartingPosition] = useState(0);
  const [endingPosition, setEndingPosition] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const pageChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);

    setStartingPosition((pageNumber - 1) * pageSize);
    setEndingPosition((pageNumber - 1) * pageSize + pageSize);
  };
  useEffect(() => {
    pageChange(currentPage, 20);
  });
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar">
        <div className="leftSideBar_Card p-0 m-0">
          <SearchSideBar />
        </div>
      </aside>

      <div className="pageContentWrap">
        <div className={styles.card}>
          <div className="d-flex mb-2 align-items-center flex-wrap relative">
            <h4 data-testid="topic_heading">Topic</h4>
            {/* <AdvanceFilter /> */}
          </div>
          <div className={styles.search_lists}>
            {searchData.topic.length ? (
              <div>
                <ul>
                  {searchData.topic
                    .slice(startingPosition, endingPosition)
                    .map((x) => {
                      return (
                        <>
                          <li>
                            <Link href={`/${x?.link}`}>
                              <a>
                                <label>{x?.type_value}</label>
                              </a>
                            </Link>

                            <span className={styles.ml_auto}>
                              {x.namespace}
                            </span>
                          </li>
                        </>
                      );
                    })}
                </ul>
              </div>
            ) : (
              showEmpty("No Data Found")
            )}
          </div>
          <Pagination
            hideOnSinglePage={true}
            total={searchData.topic?.length}
            pageSize={20}
            onChange={pageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Fragment>
  );
};
export default TopicSearch;
