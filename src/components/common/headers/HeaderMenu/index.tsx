import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";

import styles from "../siteHeader.module.scss";
import { AutoComplete, Input } from "antd";

import TopicCreationBTN from "../TopicCreationBTN";
import queryParams from "src/utils/queryParams";
import { globalSearchCanonizer } from "src/network/api/userApi";
import moment from "moment";
import { setSearchData, setSearchValue } from "src/store/slices/searchSlice";

const HeaderMenu = ({ loggedUser }: any) => {
  const [inputSearch, setInputSearch] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);
  const [searchCampStatement, setSearchCampStatement] = useState([]);
  const [searchNickname, setSearchNickname] = useState([]);
  const { searchValue } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
  }));
  const dispatch = useDispatch();

  const renderTitle = (icon: any, title: string) => (
    <span>
      {icon}
      {title}
    </span>
  );

  const renderItem = (title: any) => ({
    value: title,
    label: (
      <div>
        {title}
        <span>{/* <UserOutlined /> */}</span>
      </div>
    ),
  });
  const covertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
  };
  const options = [
    {
      label: renderTitle(
        searchTopics.length ? <i className="icon-topic"></i> : "",
        searchTopics.length ? "Topic" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchTopics?.map((x) => {
                return (
                  <>
                    <li>
                      <Link href={x.link}>
                        <a>
                          <label>{x.type_value}</label>
                        </a>
                      </Link>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        ),
      ],
    },
    {
      label: renderTitle(
        searchCamps.length ? <i className="icon-camp"></i> : "",
        searchCamps.length ? "Camp" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchCamps?.map((x) => {
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
                      <div className={styles.tags_all_search_camp_statement}>
                        {parsedData?.reverse()?.map((obj, index) => {
                          return (
                            <a href={obj.camp_link} key={obj.camp_link}>
                              {obj.camp_name}
                              {index < parsedData.length - 1 ? "/ " : ""}
                            </a>
                          );
                        })}
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        ),
      ],
    },
    {
      label: renderTitle(
        searchCampStatement.length ? <i className="icon-camp"></i> : "",
        searchCampStatement.length ? "Camp statement" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchCampStatement?.map((x) => {
                const jsonData = JSON.parse(x.breadcrumb_data);
                const parsedData = jsonData.reduce(
                  (accumulator, currentVal, index) => {
                    const accIndex = index + 1;
                    accumulator[index] = {
                      camp_name: currentVal[accIndex].camp_name,
                      camp_link: currentVal[accIndex].camp_link,
                    };
                    return accumulator;
                  },
                  []
                );
                return (
                  <>
                    <li>
                      <div className="d-flex flex-wrap g-2">
                        <a href={jsonData[0][1].camp_link}>
                          <h3 className="m-0" style={{ color: "blue" }}>
                            {jsonData[0][1].camp_name}
                          </h3>
                        </a>
                        <div style={{ marginLeft: "auto" }}>
                          <strong>Go live Time : </strong>
                          {covertToTime(x.go_live_time)}
                        </div>
                      </div>
                      <div className="d-flex flex-wrap w-100 mb-1">
                        <p className={styles.search_heading_top}>
                          <div
                            dangerouslySetInnerHTML={{ __html: x.type_value }}
                          ></div>
                        </p>
                        {/* <div
                          className={
                            styles.statement_date_search_camp_statement
                          }
                        >
                          <strong>Go live Time : </strong>
                          {covertToTime(x.go_live_time)}
                        </div> */}
                      </div>{" "}
                      <div className={styles.tags_all_search_camp_statement}>
                        {parsedData?.reverse()?.map((obj, index) => {
                          return (
                            <a href={obj.camp_link} key={obj.camp_link}>
                              {obj.camp_name}
                              {index < parsedData.length - 1 ? "/ " : ""}
                            </a>
                          );
                        })}
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        ),
      ],
    },
    {
      label: renderTitle(
        searchNickname.length ? <i className="icon-camp"></i> : "",
        searchNickname.length ? "Nickname" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchNickname?.map((x) => {
                return (
                  <>
                    <li>
                      <div className="d-flex flex-wrap">
                        <Link href={x.link}>
                          <a>
                            <label>{x.type_value}</label>
                          </a>
                        </Link>
                        <span className="ml_auto suppport_camps">
                          Supported camps:{" "}
                          <strong className={styles.yellow_color}>
                            {x.support_count}
                          </strong>{" "}
                        </span>
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
        ),
      ],
    },
    {
      options: [
        renderItem(
          <footer>
            <i className="icon-search"></i>
            <Link href="/search">
              <a>{`Search for "${searchValue}"`}</a>
            </Link>
          </footer>
        ),
      ],
    },
  ];

  const links = [
    {
      link: "/browse",
      linkTitle: "Browse",
      id: 1,
    },
    // {
    //   link: "/uploadFile",
    //   linkTitle: "Upload File",
    //   id: 2,
    // },
    {
      link: process.env.NEXT_PUBLIC_BLOG_URL,
      linkTitle: "Blog",
      id: 5,
      external: true,
    },
    {
      link: "/topic/132-Help/1-Agreement?is_tree_open=1",
      linkTitle: "Help",
      id: 3,
    },
    // {
    //   link: "/files/2012_amplifying_final.pdf",
    //   linkTitle: "White Paper",
    //   id: 4,
    //   external: true,
    // },

    // {
    //   link: "/topic/6-Canonizer-Jobs/1-Agreement?is_tree_open=1",
    //   linkTitle: "Jobs",
    //   id: 6,
    // },
  ];
  const { filterObject, filterByScore, viewThisVersion } = useSelector(
    (state: RootState) => ({
      filterObject: state?.filters?.filterObject,
      filterByScore: state.filters?.filterObject?.filterByScore,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );

  const [mockLinks, setMockLinks] = useState(links);

  const router = useRouter();

  useEffect(() => {
    if (!loggedUser?.is_admin) {
      const allLinks = [...mockLinks];
      const filteredLinks = allLinks.filter((obj) => {
        return obj.linkTitle != "Upload File";
      });

      setMockLinks(filteredLinks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);
  const getGlobalSearchCanonizer = async (queryString) => {
    let response = await globalSearchCanonizer(
      queryParams({ term: queryString })
    );
    if (response) {
      setSearchTopics(response.data.data.topic);
      setSearchCamps(response.data.data.camp);
      setSearchCampStatement(response.data.data.statement);
      setSearchNickname(response.data.data.nickname);
      dispatch(setSearchData(response?.data?.data));
    }
  };
  return (
    <Fragment>
      <nav className={styles.nav}>
        <ul>
          <li
            className={`topicDeskBTN ${
              router?.asPath === "/create/topic" ? styles.active : ""
            }`}
            key="create-topic-li"
          >
            <TopicCreationBTN key="create-topic-area" />
          </li>
          {mockLinks?.map((item, idx) => {
            return (
              <li
                className={router?.asPath === item.link ? styles.active : ""}
                key={item.id + "_" + item.link + "___" + idx}
              >
                {router?.asPath.includes("/topic") || item.external ? (
                  <a
                    href={item.link}
                    rel="noopener noreferrer"
                    target={item.external ? "_blank" : "_self"}
                  >
                    {item.linkTitle}
                  </a>
                ) : (
                  <Link
                    href={`${item.link}?score=${filterByScore}&algo=${
                      filterObject?.algorithm
                    }${
                      filterObject?.asof == "bydate"
                        ? "&asofdate=" + filterObject?.asofdate
                        : ""
                    }&asof=${filterObject?.asof}&canon=${
                      filterObject?.namespace_id
                    }${viewThisVersion ? "&viewversion=1" : ""}`}
                  >
                    <a>{item.linkTitle}</a>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="search_header">
        <AutoComplete
          popupClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={500}
          // className={"search_header"}
          options={inputSearch ? options : []}
          value={searchValue}
        >
          <Input
            size="large"
            placeholder="Search for"
            value={searchValue}
            type="text"
            name="search"
            prefix={<i className="icon-search"></i>}
            onChange={(e) => {
              dispatch(setSearchValue(e.target.value));
              setInputSearch(e.target.value);
              getGlobalSearchCanonizer(e.target.value);
            }}
          />
        </AutoComplete>
      </div>
    </Fragment>
  );
};

export default HeaderMenu;
