import React, { Fragment, useEffect, useState } from "react";
import SearchSideBar from "../../common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "../../common/AdvanceSearchFilter";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { Pagination } from "antd";
import Link from "next/link";

const CampSearch = () => {
  const [startingPosition, setStartingPosition] = useState(0);
  const [endingPosition, setEndingPosition] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const { searchData } = useSelector((state: RootState) => ({
    searchData: state?.searchSlice?.searchData,
  }));
  const pageChange = (pageNumber, pageSize) => {
    setCurrentPage(pageNumber);

    setStartingPosition((pageNumber - 1) * pageSize);
    setEndingPosition((pageNumber - 1) * pageSize + pageSize);
  };
  useEffect(() => {
    pageChange(currentPage, 20);
  });
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
        <h4 data-testid="camp_heading">Camp</h4>
        <AdvanceFilter/>
        </div>
        <div className={styles.search_lists}>
                <ul>
                    {searchData?.camp?.slice(startingPosition,endingPosition).map((x)=>{
                        const jsonData = JSON.parse(
                            x.breadcrumb_data
                          ) as Array<any>;
                          const parsedData = jsonData.reduce(
                            (accumulator, currentVal, index) => {
                              const accIndex = index + 1;
                              accumulator[index] = {
                                camp_name: currentVal[accIndex]?.camp_name == "Agreement"?currentVal[accIndex].topic_name: currentVal[accIndex].camp_name,
                                camp_link: currentVal[accIndex]?.camp_link,
                                topic_name:currentVal[accIndex]?.topic_name,
                              };
                              return accumulator;
                            },
                            []);
                            console.log(parsedData,"parseddata")
                            return (
                              <>
                                <li>
                                <Link href={`/${jsonData[0][1].camp_link}`}>
                                <a> {x.type_value}</a>
                           
                            </Link>
                                  <div className={styles.tags_all}>
                                    {parsedData.reverse().map((obj, index) => {
                                      return (
                                        <>
                                          <a href={`/${obj.camp_link}`}key={`/${obj.camp_link}`}>
                                            {obj.camp_name}
                                            {index < parsedData.length - 1 ? "/ " : ""}
                                          </a>
                                        </>
                          );
                        })}
                      </div>
                    </li>
                        </>)
                    })}
                </ul>
            </div>
            
            <Pagination
                    hideOnSinglePage={true}
                    total={searchData?.camp?.length}
                    pageSize={20}
                    onChange={pageChange}
                    showSizeChanger={false} />
        </div>
      </div>
    </Fragment>
  );
};

export default CampSearch;
