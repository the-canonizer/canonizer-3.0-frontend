import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "../../common/AdvanceSearchFilter";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import moment from "moment";
import { Pagination } from "antd";

const CampStatementSearch = () => {
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
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const fileNameLength = 800;

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
            <h4 data-testid="camp_statment_heading">Camp Statement</h4>
            <AdvanceFilter />
          </div>
          <div className={styles.search_lists}>
            <ul>
              {searchData?.statement
                ?.slice(startingPosition, endingPosition)
                .map((x) => {
                  const jsonData = JSON.parse(x.breadcrumb_data) as Array<any>;
                  const parsedData = jsonData.reduce(
                    (accumulator, currentVal, index) => {
                      const accIndex = index + 1;
                      accumulator[index] = {
                        camp_name:
                          currentVal[accIndex]?.camp_name == "Agreement"
                            ? currentVal[accIndex]?.topic_name
                            : currentVal[accIndex]?.camp_name,
                        camp_link: currentVal[accIndex]?.camp_link,
                        topic_name: currentVal[accIndex]?.topic_name,
                      };
                      return accumulator;
                    },
                    []
                  );
                  return (
                    <>
                      <li>
                        <a href={`/${jsonData[0][1].camp_link}`}>
                          <h3 className={styles.statement_heading}>
                            {jsonData.length > 1
                              ? jsonData[0][1].camp_name
                              : jsonData[0][1].topic_name}
                          </h3>
                        </a>
                        <div className={styles.statement_date}>
                          <strong>Go live Time : </strong>
                          {covertToTime(x.go_live_time)}
                        </div>
                        <div className="d-flex flex-wrap w-100 mb-1">
                          {/* <a className={styles.search_heading}>  */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                x.type_value.substring(0, fileNameLength) +
                                "...",
                            }}
                          ></div>
                        </div>
                        <div className={styles.tags_all}>
                          {parsedData.reverse().map((obj, index) => {
                            return (
                              <>
                                <a
                                  href={`/${obj.camp_link}`}
                                  key={`/${obj.camp_link}`}
                                >
                                  {obj.camp_name}
                                  {index < parsedData.length - 1 ? "/ " : ""}
                                </a>
                              </>
                            );
                          })}
                        </div>
                      </li>
                    </>
                  );
                })}
            </ul>
          </div>
          <Pagination
            hideOnSinglePage={true}
            total={searchData?.statement?.length}
            pageSize={20}
            onChange={pageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CampStatementSearch;
