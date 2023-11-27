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
import { key } from "localforage";

const HeaderMenu = ({ loggedUser }: any) => {
  const [inputSearch, setInputSearch] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);
  const [searchCampStatement, setSearchCampStatement] = useState([]);
  const [searchNickname, setSearchNickname] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  let { searchValue } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
  }));

  const router = useRouter();

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
  useEffect(() => {
    if (searchValue?.length == 0) {
      // const localSearch = localStorage.getItem("searchValue");
      searchValue = router?.asPath
        ?.split("=")[1]
        ?.split("+")
        .join(" ")
        ?.replace(/%20/g, " ");
      setSearchVal("");
      // if (localSearch) {
      dispatch(setSearchValue(searchValue));
      getGlobalSearchCanonizer(searchValue, true);
      // }
    }
  }, []);

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
              {searchTopics.slice(0, 5)?.map((x) => {
                return (
                  <>
                    <li>
                      <Link href={`/${x.link}`}>
                        <a>
                          <label>{x.type_value}</label>
                        </a>
                      </Link>
                    </li>
                  </>
                );
              })}
            </ul>
            {searchTopics.length ? (
              <span className={styles.bold_margin}></span>
            ) : (
              ""
            )}
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
              {searchCamps.slice(0, 5)?.map((x) => {
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
                    };
                    return accumulator;
                  },
                  []
                );

                return (
                  <>
                    <li>
                      <Link href={`/${jsonData[0][1]?.camp_link}`}>
                        <a className={styles.camp_heading_color}>
                          {" "}
                          {x.type_value}
                        </a>
                      </Link>

                      <div className={styles.tags_all_search_camp_statement}>
                        {parsedData?.reverse()?.map((obj, index) => {
                          return (
                            <a
                              href={`/${obj.camp_link}`}
                              key={`/${obj.camp_link}`}
                            >
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
            {searchCamps.length ? (
              <span className={styles.bold_margin}></span>
            ) : (
              ""
            )}
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
              {searchCampStatement.slice(0, 5)?.map((x) => {
                const jsonData = JSON.parse(x.breadcrumb_data) as Array<any>;
                const parsedData = jsonData?.reduce(
                  (accumulator, currentVal, index) => {
                    const accIndex = index + 1;
                    accumulator[index] = {
                      camp_name:
                        currentVal[accIndex].camp_name == "Agreement"
                          ? currentVal[accIndex].topic_name
                          : currentVal[accIndex].camp_name,
                      camp_link: currentVal[accIndex].camp_link,
                      topic_name: currentVal[accIndex].topic_name,
                    };
                    return accumulator;
                  },
                  []
                );
                return (
                  <>
                    <li>
                      <div className="d-flex flex-wrap g-2">
                        <a href={`/${jsonData?.[0]?.[1]?.camp_link}`}>
                          <h3 className="m-0">
                            {jsonData?.length > 1
                              ? jsonData?.[0]?.[1]?.camp_name
                              : jsonData?.[0]?.[1].topic_name}
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
                      </div>
                      {/* {" "} */}

                      <div className={styles.tags_all_search_camp_statement}>
                        {parsedData?.reverse()?.map((obj, index) => {
                          return (
                            <a
                              href={`/${obj.camp_link}`}
                              key={`/${obj.camp_link}`}
                            >
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
            {searchCampStatement.length ? (
              <span className={styles.bold_margin}></span>
            ) : (
              ""
            )}
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
              {searchNickname.slice(0, 5)?.map((x) => {
                return (
                  <>
                    <li>
                      <div className="d-flex flex-wrap">
                        <Link href={`/${x.link}`}>
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
            {searchNickname.length ? (
              <span className={styles.bold_margin}></span>
            ) : (
              ""
            )}
          </div>
        ),
      ],
    },
    {
      options: [
        renderItem(
          <footer>
            <i className="icon-search"></i>
            <Link
              href={{
                pathname: "/search",
                query: { q: searchValue },
              }}
            >
              <a
                onClick={() => handleSearchfor()}
              >{`Search for "${searchValue}"`}</a>
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
  ];

  const [mockLinks, setMockLinks] = useState(links);

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
  const getGlobalSearchCanonizer = async (queryString, onPresEnter) => {
    let response = await globalSearchCanonizer(
      queryParams({ term: queryString })
    );
    if (response) {
      setSearchTopics(response.data.data.topic);
      setSearchCamps(response.data.data.camp);
      setSearchCampStatement(response.data.data.statement);
      setSearchNickname(response.data.data.nickname);
      if (onPresEnter) {
        dispatch(setSearchData(response?.data?.data));
      }
    }
  };

  const handleSearchfor = () => {
    setInputSearch("");
    setSearchVal("");
    getGlobalSearchCanonizer(searchValue, true);
  };

  const handlePress = (e) => {
    setInputSearch("");
    setSearchVal("");
    router.push({
      pathname: "/search",
      query: { q: searchValue },
    });
  };
  return (
    <Fragment>
      <nav className={styles.nav}>
        <ul>
          <li
            className={`topicDeskBTN d-none d-lg-block ${
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
                  <Link href={item.link}>
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
          dropdownMatchSelectWidth={false}
          // className={"search_header"}
          options={inputSearch ? options : []}
          value={searchVal}
        >
          <Input
            size="large"
            placeholder="Search for"
            value={searchVal}
            type="text"
            name="search"
            prefix={<i className="icon-search"></i>}
            onChange={(e) => {
              // localStorage.setItem("searchValue", e.target.value);

              dispatch(setSearchValue(e.target.value));
              setInputSearch(e.target.value);
              setSearchVal(e.target.value);
              getGlobalSearchCanonizer(e.target.value, false);
            }}
            onPressEnter={(e) => {
              // localStorage.setItem("searchValue",(e.target as HTMLTextAreaElement).value)
              // !router.asPath.includes("/search") ? handlePress(e) : "";
              handlePress(e);
              getGlobalSearchCanonizer(
                (e.target as HTMLTextAreaElement).value,
                true
              );
            }}
          />
        </AutoComplete>
      </div>
    </Fragment>
  );
};

export default HeaderMenu;
