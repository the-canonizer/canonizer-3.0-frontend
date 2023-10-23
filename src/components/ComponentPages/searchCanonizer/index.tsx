import React, { Fragment } from "react";
import SearchSideBar from "@/components/common/SearchSideBar";
import styles from "./search.module.scss";
import { List, Tag } from "antd";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import moment from "moment";
const Search = () => {
  const { searchData } = useSelector((state: RootState) => ({
    searchData: state?.searchSlice?.searchData,
  }));
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
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
          <h4>Topic</h4>
          <div className={styles.search_lists}>
            <ul>
              {searchData.topic.map((x) => {
                return (
                  <>
                    <li>
                      <Link href={x.link}>
                        <a>
                          <label>{x.type_value}</label>
                        </a>
                      </Link>

                      <span className={styles.ml_auto}>{x.namespace}</span>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
          <h4>Camp</h4>

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
                      <Link href={jsonData[0][1].camp_link}>
                        <a> {x.type_value}</a>
                      </Link>
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
          <h4>Camp Statement</h4>
          <div className={styles.search_lists}>
            <ul>
              {searchData.statement.map((x) => {
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
                      <a href={jsonData[0][1].camp_link}>
                        <h3>{jsonData[0][1].camp_name}</h3>
                      </a>
                      <div className={styles.statement_date}>
                        <strong>Go live Time : </strong>
                        {covertToTime(x.go_live_time)}
                      </div>
                      <div className="d-flex flex-wrap w-100 mb-1">
                        {/* <a className={styles.search_heading}>  */}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: x.type_value.substring(0, 800) + "...",
                          }}
                        ></div>
                      </div>
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

          <h4>Nickname</h4>
          <div className={styles.search_lists}>
            <ul>
              {searchData.nickname.map((x) => {
                return (
                  <>
                    <li>
                      <Link href={x.link}>
                        <a>
                          <label>{x.type_value}</label>
                        </a>
                      </Link>

                      <span className={styles.ml_auto}>
                        Supported camps:{" "}
                        <strong className={styles.yellow_color}>
                          {x.support_count}
                        </strong>{" "}
                      </span>
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

export default Search;