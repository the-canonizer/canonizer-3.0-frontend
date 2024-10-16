import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import debounce from "lodash/debounce";
import styles from "../siteHeader.module.scss";
import { AutoComplete, Button, Empty, Input } from "antd";

import TopicCreationBTN from "../TopicCreationBTN";
import queryParams from "src/utils/queryParams";
import { globalSearchCanonizer } from "src/network/api/userApi";
import moment from "moment";
import {
  setSearchData,
  setSearchMetaData,
  setSearchValue,
  setSearchDataAll,
  setClickAdvanceFilterOption,
} from "src/store/slices/searchSlice";
import CustomSkelton from "../../customSkelton";
import { setSearchLoadingAction } from "src/store/slices/loading";
import filter from "src/assets/image/face.png";
import Image from "next/image";


interface HighlightedForCampStatementProps {
  text?: string;
  highlight: string;
}
interface HighlightedProps {
  text?: string;
  highlight: string;
}

const HeaderMenu = ({ loggedUser }: any) => {
  const [inputSearch, setInputSearch] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);
  const [searchCampStatement, setSearchCampStatement] = useState([]);
  const [searchNickname, setSearchNickname] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [loadingSekelton, setLoadingSekelton] = useState(true);

  let { searchValue } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
  }));
  const { pageNumber } = useSelector((state: RootState) => ({
    pageNumber: state?.searchSlice?.pageNumber,
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
      if (inputSearch) {
        dispatch(setSearchValue(searchValue));
        getGlobalSearchCanonizer(searchValue, true);
      }
    }
  }, []);
  const showEmpty = (msg) => {
    return <Empty description={msg} />;
  };
  const Highlighted: React.FC<HighlightedProps> = ({
    text = "",
    highlight = "",
  }) => {
    if (!highlight.trim()) {
      return <label>{text}</label>;
    }
    const highlightWords = highlight.trim().split(/\s+/); // Split the highlight string into individual words
  const escapedHighlightWords = highlightWords.map(word => word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));
  const regexPattern = highlightWords.length > -1 ? `(${escapedHighlightWords.join('|')})` : escapedHighlightWords[0];
  const regex = new RegExp(regexPattern, "gi");
  const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark className={styles.highlighter} key={i}>
              {part}
            </mark>
          ) : (
            <label
              style={{ cursor: "pointer", fontWeight: "bold" }}
              className={styles.highlighter}
              key={i}
            >
              {part}
            </label>
          )
        )}
      </>
    );
  };
  function replaceSpecialCharactersInLink(link) {
    // Replace each special character (excluding slashes) with a hyphen
    link = link.replace(/[-\\^$*+?.()|%#@[\]{}]/g, "-");
  
    // Define the "/topic/" string
    let topicString = "/topic/";
    let topicIndex = link.indexOf(topicString);
    if (topicIndex === 1) {
      // If '/topic/' is not found, return the modified link with special characters replaced
      return link;
    }
  
    // Find the index of the last slash in the link
    let lastSlashIndex = link.lastIndexOf('/');
    
    // Extract parts of the URL
    let beforeTopic = link.substring(0, topicIndex + topicString.length); // '/topic/' part
    let betweenTopicAndLast = link.substring(topicIndex + topicString.length, lastSlashIndex);
    let afterLastSlash = link.substring(lastSlashIndex);
  
    // Replace slashes in the part between '/topic/' and the last slash with hyphens
    betweenTopicAndLast = betweenTopicAndLast.replace(/\//g, "-");
  
    // Reconstruct the final link
    let finalLink = beforeTopic + betweenTopicAndLast + afterLastSlash;
    return finalLink;
  }
  
  const searchValueLength = 30;
  const advanceSearchValueLength = 100;
  const options = [
    {
      label: renderTitle(
        searchTopics && searchTopics?.length ? (
          <i className="icon-topic"></i>
        ) : (
          ""
        ),
        searchTopics && searchTopics?.length ? "Topic" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchTopics?.slice(0, 5)?.map((x) => {
                {
                  return (
                    <>
                      <li style={{ cursor: "default" }}>
                        <Link
                          href={`/${replaceSpecialCharactersInLink(x.link)}`}
                        >
                          <a>
                            <Highlighted
                              text={x.type_value}
                              highlight={searchValue}
                            />
                          </a>
                        </Link>
                      </li>
                    </>
                  );
                }
              })}
            </ul>
            {searchTopics?.length ? (
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
        searchCamps && searchCamps?.length ? <i className="icon-camp"></i> : "",
        searchCamps && searchCamps?.length ? "Camp" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchCamps?.slice(0, 5)?.map((x) => {
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
                {
                  return (
                    <>
                      <li style={{ cursor: "default" }}>
                        <Link href={`/${jsonData[0][1]?.camp_link}`}>
                          <a className={styles.camp_heading_color}>
                            {" "}
                            <Highlighted
                              text={x.type_value}
                              highlight={searchValue}
                            />
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
                                {index < parsedData?.length - 1 ? "/ " : ""}
                              </a>
                            );
                          })}
                        </div>
                      </li>
                    </>
                  );
                }
              })}
            </ul>
            {searchCamps?.length ? (
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
        searchCampStatement && searchCampStatement?.length ? (
          <i className="icon-camp"></i>
        ) : (
          ""
        ),
        searchCampStatement && searchCampStatement?.length
          ? "Camp statement"
          : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchCampStatement?.slice(0, 5)?.map((x) => {
                const jsonData = JSON.parse(x?.breadcrumb_data) as Array<any>;
                const parsedData = jsonData?.reduce(
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
                {
                  const HighlightedForCampStatement: React.FC<
                    HighlightedForCampStatementProps
                  > = ({ text = "", highlight = "" }) => {
                    if (!highlight.trim()) {
                      return <span>{text}</span>;
                    }
                    const escapedHighlight = highlight.replace(
                      /[-/\\^$*+?.()|[\]{}]/g,
                      "\\$&"
                    );
                    const words = highlight
                      .split(/\s+/)
                      .map((word) =>
                        word.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
                      );
                    const regex = new RegExp(
                      `\\b(${words.join("|")})\\b`,
                      "gi"
                    );
                    const parts = text.split(regex);
                    return (
                      <>
                        {parts
                          .filter((part) => part)
                          .map((part, i) =>
                            regex.test(part) ? (
                              <mark
                                className={styles.highlighterforCampStatement}
                                key={i}
                                dangerouslySetInnerHTML={{ __html: part }}
                              ></mark>
                            ) : (
                              <label
                                className={styles.highlighterforCampStatement}
                                key={i}
                                dangerouslySetInnerHTML={{ __html: part }}
                              ></label>
                            )
                          )}
                      </>
                    );
                  };
                  return (
                    <>
                      <li style={{ cursor: "default" }}>
                        <div className="d-flex flex-wrap g-2">
                          <a
                            style={{ cursor: "pointer" }}
                            href={`/${jsonData?.[0]?.[1]?.camp_link}`}
                          >
                            <h3 className="m-0">
                              {jsonData?.length > 1 ? (
                                <HighlightedForCampStatement
                                  text={jsonData?.[0]?.[1]?.camp_name}
                                  highlight={searchValue}
                                />
                              ) : (
                                <HighlightedForCampStatement
                                  text={jsonData?.[0]?.[1]?.topic_name}
                                  highlight={searchValue}
                                />
                              )}
                            </h3>
                          </a>
                          <div style={{ marginLeft: "auto" }}>
                            <strong>Go live Time : </strong>
                            {covertToTime(x?.go_live_time)}
                          </div>
                        </div>
                        <div className="d-flex flex-wrap w-100 mb-1">
                          <div>
                            <HighlightedForCampStatement
                              text={x.type_value.replace(/<p>/g, "")}
                              highlight={searchValue}
                            />
                          </div>
                        </div>
                        {/* {" "} */}

                        <div className={styles.tags_all_search_camp_statement}>
                          {parsedData?.reverse()?.map((obj, index) => {
                            return (
                              <a
                                href={`/${obj?.camp_link}`}
                                key={`/${obj?.camp_link}`}
                              >
                                {obj?.camp_name}
                                {index < parsedData?.length - 1 ? "/ " : ""}
                              </a>
                            );
                          })}
                        </div>
                      </li>
                    </>
                  );
                }
              })}
            </ul>
            {searchCampStatement?.length ? (
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
        searchNickname && searchNickname?.length ? (
          <Image
                  className={styles.nickname_icon}
                  id="nick_name"
                  alt="face Image"
                  src={filter}
                  width={15}
                  height={15}
                />
        ) : (
          ""
        ),
        searchNickname && searchNickname?.length ? "Nickname" : ""
      ),
      options: [
        renderItem(
          <div className={styles.search_lists}>
            <ul>
              {searchNickname?.slice(0, 5)?.map((x) => {
                {
                  return (
                    <>
                      <li style={{ cursor: "default" }}>
                        <div className="d-flex flex-wrap">
                          <Link href={`${x.link}`}>
                            <a>
                              <Highlighted
                                text={x.type_value}
                                highlight={searchValue}
                              />
                            </a>
                          </Link>
                          <span className="ml_auto suppport_camps">
                            Supported camps:{" "}
                            <strong className={styles.yellow_color}>
                              {x.support_count == "" ? 0 : x.support_count}
                            </strong>{" "}
                          </span>
                        </div>
                      </li>
                    </>
                  );
                }
              })}
            </ul>
            {searchNickname?.length ? (
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
              <a onClick={() => handleSearchfor()}>{`Search for "${
                searchValue.length > searchValueLength
                  ? searchValue.substring(0, searchValueLength) + "..."
                  : searchValue
              }"`}</a>
            </Link>
          </footer>
        ),
      ],
    },
  ];
  const no = [
    {
      options: [renderItem(showEmpty("No Data Found"))],
    },
  ];
  const loader = [
    {
      options: [
        renderItem(
          <CustomSkelton
            skeltonFor="search"
            bodyCount={10}
            stylingClass=""
            // isButton={false}
          />
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
    {
      link: "/videos",
      linkTitle: "Videos",
      id: 6,
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
  const [preventInitialRender, setPreventInitialRender] = useState(true);
  useEffect(() => {
    if (preventInitialRender && pageNumber !== 1)
      setPreventInitialRender(false);
    else if (
      (inputSearch || searchValue) &&
      router.pathname.includes("/search")
    ) {
      getGlobalSearchCanonizerNav(searchValue);
    }
    setPreventInitialRender(false);
    return () => {
      setPreventInitialRender(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, router?.pathname]);
  const getGlobalSearchCanonizerNav = async (queryString) => {
    let queryParamObj: any = {
      term: queryString,
      size: 20,
      page: pageNumber,
    };
    switch (router.pathname) {
      case "/search":
        queryParamObj = {
          term: queryString,
        };
        break;
      case "/search/topic":
        queryParamObj.type = "topic";
        break;
      case "/search/camp":
        queryParamObj.type = "camp";
        break;
      case "/search/camp_statement":
        queryParamObj.type = "statement";
        break;
      case "/search/nickname":
        queryParamObj.type = "nickname";
        break;
      default:
        queryParamObj.type = "all";
        break;
    }
    dispatch(setSearchLoadingAction(true));
    let response = await globalSearchCanonizer(queryParams(queryParamObj));
    if (response) {
      setSearchTopics(response.data.data.topic);
      setSearchCamps(response.data.data.camp);
      setSearchCampStatement(response.data.data.statement);
      setSearchNickname(response.data.data.nickname);
      if (
        router.pathname == "/search/topic" ||
        router.pathname == "/search/camp" ||
        router.pathname == "/search/camp_statement" ||
        router.pathname == "/search/nickname"
      ) {
        dispatch(setSearchDataAll(response?.data?.data));
        dispatch(setSearchMetaData(response?.data?.meta_data));
        // dispatch(setSearchLoadingAction(false));
      }
    }
    dispatch(setSearchLoadingAction(false));
  };
  const getGlobalSearchCanonizer = async (queryString, onPresEnter) => {
    // dispatch(setLoadingAction(true))
    let response = await globalSearchCanonizer(
      queryParams({ term: queryString == undefined ? "" : queryString })
    );
    if (response) {
      setSearchTopics(response.data.data.topic);
      setSearchCamps(response.data.data.camp);
      setSearchCampStatement(response.data.data.statement);
      setSearchNickname(response.data.data.nickname);
      if (onPresEnter) {
        // dispatch(setSearchLoadingAction(true));
        dispatch(setSearchData(response?.data?.data));
        dispatch(setSearchLoadingAction(false));
      }
      setLoadingSekelton(false);
    }
  };

  const handleSearchfor = () => {
    setInputSearch("");
    setSearchVal("");
    getGlobalSearchCanonizer(searchValue, true);
  };

  const handlePress = () => {
    setInputSearch("");
    setSearchVal("");
    router.push({
      pathname: "/search",
      query: { q: searchValue },
    });
  };
  const debounceFn = useMemo(
    () => debounce(getGlobalSearchCanonizer, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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

      {process.env.NEXT_PUBLIC_NEW_SEARCH_BAR ? (
        <div className="search_header">
          <AutoComplete
            popupClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            options={
              inputSearch == ""
                ? []
                : loadingSekelton
                ? loader
                : searchTopics?.length ||
                  searchCamps?.length ||
                  searchCampStatement?.length ||
                  searchNickname?.length
                ? options
                : no
            }
            value={
              searchVal.length > advanceSearchValueLength
                ? searchVal.substring(0, advanceSearchValueLength)
                : searchVal
            }
          >
            <div>
              <Button>
                <i className="icon-search"></i>
              </Button>
              <Input
                size="large"
                placeholder="Search for"
                value={
                  searchVal.length > advanceSearchValueLength
                    ? searchVal.substring(0, advanceSearchValueLength)
                    : searchVal
                }
                type="text"
                name="search"
                onChange={(e) => {
                  setLoadingSekelton(true);
                  dispatch(setSearchValue(e.target.value));
                  setInputSearch(e.target.value);
                  setSearchVal(e.target.value);
                  debounceFn.cancel();
                  if (e?.target?.value) debounceFn(e.target.value, false);
                }}
                onPressEnter={(e) => {
                  handlePress();
                  if ((e.target as HTMLTextAreaElement).value)
                    getGlobalSearchCanonizer(
                      (e.target as HTMLTextAreaElement).value,
                      true
                    );
                }}
              />
            </div>
          </AutoComplete>
        </div>
      ) : null}
    </Fragment>
  );
};

export default HeaderMenu;
