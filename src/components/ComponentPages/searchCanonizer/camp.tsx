import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss";
import AdvanceFilter from "@/components/common/AdvanceSearchFilter";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

const CampSearch = () => {
  const { searchData } = useSelector((state: RootState) => ({
    searchData: state?.searchSlice?.searchData,
  }));
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
            <h4>Camp</h4>
            <AdvanceFilter />
          </div>
          <div className={styles.search_lists}>
            <ul>
              {searchData.camp.map((x) => {
                const jsonData = JSON.parse(x.breadcrumb_data) as Array<any>;
                const parsedData = jsonData.reduce(
                  (accumulator, currentVal, index) => {
                    const accIndex = index + 1;
                    accumulator[index] = {
                      camp_name: currentVal[accIndex]?.camp_name,
                      camp_link: currentVal[accIndex]?.camp_link,
                    };
                    return accumulator;
                  },
                  []
                );
                return (
                  <>
                    <li>
                      {x.type_value}
                      <div className={styles.tags_all}>
                        {parsedData.reverse().map((obj, index) => {
                          return (
                            <>
                              <a href={obj.camp_link} key={obj.camp_link}>
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
        </div>
      </div>
    </Fragment>
  );
};

export default CampSearch;
