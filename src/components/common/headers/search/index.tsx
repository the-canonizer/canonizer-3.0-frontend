import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { AutoComplete, Card, Empty, List, Popover, Typography } from "antd";
// import moment from "moment";
import {
  EyeOutlined,
  FlagOutlined,
  RightOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import type { TabsProps } from "antd";

import styles from "./search.module.scss";

import { RootState } from "../../../../store";
import queryParams from "src/utils/queryParams";
import { globalSearchCanonizer } from "src/network/api/userApi";
import {
  setSearchData,
  setSearchMetaData,
  setSearchValue,
  setSearchDataAll,
} from "src/store/slices/searchSlice";
import CustomSkelton from "../../customSkelton";
import { setSearchLoadingAction } from "src/store/slices/loading";
import SearchInputs from "src/components/shared/FormInputs/search";
import CustomTabs from "src/components/shared/Tabs";

const getHighlightedText = (text, highlight) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {" "}
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          {part}
        </span>
      ))}{" "}
    </span>
  );
};

function replaceSpecialCharactersInLink(link) {
  // Replace each special character with a series of hyphens
  // return link.replace(/[-\\^$*+?.()|%#|[\]{}]/g, "-");
  return link.replace(/[-\\^$*+?.()|%#|[\]{}@]/g, "-");
}

// const covertToTime = (unixTime) => {
//   return moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");
// };

const renderItem = (title: any) => ({
  value: title,
  label: <div className="titleDiv">{title}</div>,
});

const searchValueLength = 30;
const advanceSearchValueLength = 100;

const HeaderSearch = ({ className = "" }: any) => {
  const router = useRouter(),
    dispatch = useDispatch();

  let { searchValue, pageNumber } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
    pageNumber: state?.searchSlice?.pageNumber,
  }));

  const [inputSearch, setInputSearch] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);
  const [searchCampStatement, setSearchCampStatement] = useState([]);
  const [searchNickname, setSearchNickname] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [loadingSekelton, setLoadingSekelton] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(false);

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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Results",
      children: (
        <AllItems
          searchValue={searchValue}
          searchTopics={searchTopics}
          searchCamps={searchCamps}
          searchCampStatement={searchCampStatement}
          searchNickname={searchNickname}
        />
      ),
    },
    {
      key: "2",
      label: "Topics",
      children: (
        <TopicItems searchTopics={searchTopics} searchValue={searchValue} />
      ),
    },
    {
      key: "3",
      label: "Camps",
      children: (
        <CampItems searchCamps={searchCamps} searchValue={searchValue} />
      ),
    },
    {
      key: "4",
      label: "Camp Statement",
      children: (
        <CampStatementsItems
          searchValue={searchValue}
          searchCampStatement={searchCampStatement}
        />
      ),
    },
    {
      key: "5",
      label: "Nicknames",
      children: (
        <NickNamesItems
          searchValue={searchValue}
          searchNickname={searchNickname}
        />
      ),
    },
  ];

  const handleSearchfor = () => {
    setInputSearch("");
    setSearchVal("");
    getGlobalSearchCanonizer(searchValue, true);
  };

  const options = [
    {
      label: "",
      options: [
        renderItem(
          <CustomTabs
            defaultActiveKey="1"
            items={items}
            className="text-base font-normal font-inter"
          />
        ),
      ],
    },
    {
      label: "",
      options: [
        renderItem(
          <FooterItems
            searchValue={searchValue}
            handleSearchfor={handleSearchfor}
          />
        ),
      ],
    },
  ];

  const no = [
    {
      options: [renderItem(showEmpty("No results found. Try searching by using a different keyword."))],
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

  const handlePress = () => {
    setInputSearch("");
    setSearchVal("");
    router.push({
      pathname: "/search",
      query: { q: searchValue },
    });
  };

  const debounceFn = useMemo(() => debounce(getGlobalSearchCanonizer, 500), []);

  return (
    <Fragment>
      {/* <div className="md:hidden"> */}
      <AutoComplete
        popupClassName={`max-w-2xl w-full bg-white ${styles.searchCategories} md:*:hidden`}
        dropdownMatchSelectWidth={false}
        // defaultOpen={true}
        // open={true}
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
        onFocus={(e) => {
          console.log("eee--", e);
          setIsFullWidth(true);
        }}
        onBlur={(e) => {
          console.log("eee--", e);
          setIsFullWidth(false);
        }}
        className={`ml-5 transition-all delay-300 [&>div]:!border-0 ${
          isFullWidth ? styles.widthScroll : ""
        }`}
      >
        <div
          className={`w-auto h-auto flex items-center ${className} md:*:hidden`}
        >
          <SearchInputs
            placeholder="Search via keyword"
            value={
              searchVal.length > advanceSearchValueLength
                ? searchVal.substring(0, advanceSearchValueLength)
                : searchVal
            }
            className={`${styles.searchInput} text-medium font-medium`}
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
      <div className="hidden md:block ml-auto mr-1">
        <Link href="/search">
          <a className="text-medium text-black hover:text-blue">
            <SearchOutlined />
          </a>
        </Link>
      </div>
    </Fragment>
  );
};

export default HeaderSearch;

const AllItems = ({
  searchTopics,
  searchCamps,
  searchCampStatement,
  searchNickname,
  searchValue,
}) => (
  <Fragment>
    <TopicItems searchTopics={searchTopics} searchValue={searchValue} />
    <br />
    <CampItems searchCamps={searchCamps} searchValue={searchValue} />
    <br />
    <CampStatementsItems
      searchValue={searchValue}
      searchCampStatement={searchCampStatement}
    />
    <br />
    <NickNamesItems searchValue={searchValue} searchNickname={searchNickname} />
  </Fragment>
);

const TopicItems = ({ searchTopics, searchValue }) => (
  <Card className={`border-0 h-100 bg-gr ${styles.ItemCard}`} title="Topic(s)">
    <List
      size="small"
      dataSource={searchTopics?.slice(0, 5)}
      footer={
        searchTopics?.length ? <span className={styles.bold_margin}></span> : ""
      }
      renderItem={(item: any) => (
        <List.Item className="w-full flex font-medium">
          <Link href={`/${replaceSpecialCharactersInLink(item.link)}`}>
            <a className="flex justify-between w-full items-start">
              <span>
                {getHighlightedText(item.type_value, searchValue)}
                <div className="text-left flex">
                  <Popover content="Share Topic" placement="top">
                    <Typography.Paragraph className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex items-center leading-1 mb-0 mr-3">
                      <FlagOutlined className="text-black p-1 text-medium" />
                      <Link href="">
                        <a className="text-blue text-base font-inter font-medium hover:hblue">
                          General
                        </a>
                      </Link>
                    </Typography.Paragraph>
                  </Popover>
                  <Typography.Paragraph className="m-0 text-light font-medium font-inter flex items-center">
                    <EyeOutlined className="text-black p-1 text-medium" /> 123
                  </Typography.Paragraph>
                </div>
              </span>
              <RightOutlined className="ml-auto" />
            </a>
          </Link>
        </List.Item>
      )}
    />
  </Card>
);

const CampItems = ({ searchCamps, searchValue }) => (
  <Card className={`border-0 h-100 bg-gr ${styles.ItemCard}`} title="Camp(s)">
    <List
      size="small"
      dataSource={searchCamps?.slice(0, 5)}
      footer={
        searchCamps?.length ? (
          <span className={styles.bold_margin}></span>
        ) : null
      }
      renderItem={(item: any) => {
        const jsonData = JSON.parse(item.breadcrumb_data) as Array<any>;
        // const parsedData = jsonData.reduce((accumulator, currentVal, index) => {
        //   const accIndex = index + 1;
        //   accumulator[index] = {
        //     camp_name:
        //       currentVal[accIndex]?.camp_name == "Agreement"
        //         ? currentVal[accIndex]?.topic_name
        //         : currentVal[accIndex]?.camp_name,
        //     camp_link: currentVal[accIndex]?.camp_link,
        //   };
        //   return accumulator;
        // }, []);

        return (
          <List.Item className="w-full flex font-medium items-start">
            <div className="">
              <Link href={`/${jsonData[0][1]?.camp_link}`}>
                <a className="flex justify-between w-full items-start">
                  <span>
                    {getHighlightedText(item.type_value, searchValue)}
                    <div className="text-left flex">
                      <Typography.Paragraph className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex items-center leading-1 mb-0 mr-3">
                        <svg
                          width="13"
                          height="16"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1"
                        >
                          <g clipPath="url(#clip0_31_13108)">
                            <path
                              d="M3.4066 2.96875C3.07267 2.96875 2.79946 3.23594 2.79946 3.5625V15.4375C2.79946 15.7641 3.07267 16.0312 3.4066 16.0312H11.9066V13.0625C11.9066 12.4057 12.4492 11.875 13.1209 11.875H16.1566V3.5625C16.1566 3.23594 15.8834 2.96875 15.5495 2.96875H3.4066ZM11.9066 17.8125H3.4066C2.06709 17.8125 0.978027 16.7475 0.978027 15.4375V3.5625C0.978027 2.25254 2.06709 1.1875 3.4066 1.1875H15.5495C16.889 1.1875 17.978 2.25254 17.978 3.5625V11.875V12.0791C17.978 12.71 17.7238 13.3148 17.2684 13.7602L13.8343 17.1186C13.3789 17.5639 12.7604 17.8125 12.1153 17.8125H11.9066Z"
                              fill="#242B37"
                            />
                            <path
                              d="M9.88172 4.88394C9.8077 4.73405 9.65128 4.63867 9.47949 4.63867C9.3077 4.63867 9.15267 4.73405 9.07726 4.88394L8.17922 6.68667L6.17364 6.97555C6.00605 7.00007 5.86638 7.11453 5.81471 7.27123C5.76303 7.42793 5.80493 7.60099 5.92504 7.71681L7.38034 9.12166L7.03677 11.107C7.00883 11.2705 7.07867 11.4367 7.21693 11.5335C7.3552 11.6302 7.53816 11.6425 7.689 11.5648L9.48089 10.6314L11.2728 11.5648C11.4236 11.6425 11.6066 11.6316 11.7448 11.5335C11.8831 11.4354 11.9529 11.2705 11.925 11.107L11.58 9.12166L13.0353 7.71681C13.1554 7.60099 13.1987 7.42793 13.1457 7.27123C13.0926 7.11453 12.9543 7.00007 12.7867 6.97555L10.7798 6.68667L9.88172 4.88394Z"
                              fill="#242B37"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_31_13108">
                              <rect
                                width="17"
                                height="19"
                                fill="white"
                                transform="translate(0.978027)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Topic:
                        <Link href="">
                          <a className="text-blue text-base font-inter font-medium hover:hblue ml-1">
                            topic name
                          </a>
                        </Link>
                      </Typography.Paragraph>
                    </div>
                  </span>
                </a>
              </Link>
              {/* <div className="">
                {parsedData?.reverse()?.map((obj, index) => {
                  return (
                    <a href={`/${obj.camp_link}`} key={`/${obj.camp_link}`}>
                      {obj.camp_name}
                      {index < parsedData?.length - 1 ? "/ " : ""}
                    </a>
                  );
                })}
              </div> */}
            </div>
            <RightOutlined className="ml-auto" />
          </List.Item>
        );
      }}
    />
  </Card>
);

const CampStatementsItems = ({ searchCampStatement, searchValue }) => (
  <Card
    className={`border-0 h-100 bg-gr ${styles.ItemCard}`}
    title="Camp Statement(s)"
  >
    <List
      size="small"
      dataSource={searchCampStatement?.slice(0, 5)}
      footer={
        searchCampStatement?.length ? (
          <span className={styles.bold_margin}></span>
        ) : null
      }
      renderItem={(item: any) => {
        const jsonData = JSON.parse(item?.breadcrumb_data) as Array<any>;
        // const parsedData = jsonData?.reduce(
        //   (accumulator, currentVal, index) => {
        //     const accIndex = index + 1;
        //     accumulator[index] = {
        //       camp_name:
        //         currentVal[accIndex]?.camp_name == "Agreement"
        //           ? currentVal[accIndex]?.topic_name
        //           : currentVal[accIndex]?.camp_name,
        //       camp_link: currentVal[accIndex]?.camp_link,
        //       topic_name: currentVal[accIndex]?.topic_name,
        //     };
        //     return accumulator;
        //   },
        //   []
        // );

        return (
          <List.Item className="w-full flex font-medium items-start">
            <div className="">
              <Typography.Paragraph className="bg-transparent border-0 p-0 flex items-center leading-1 mb-0 mr-3">
                <Link href={`/${jsonData[0][1]?.camp_link}`}>
                  <a className="flex justify-between w-full items-start *text-black">
                    {getHighlightedText(
                      jsonData?.[0]?.[1]?.camp_name,
                      searchValue
                    )}
                  </a>
                </Link>
              </Typography.Paragraph>
              <Typography.Paragraph className="bg-transparent border-0 p-0 flex items-center leading-1 mb-0 mr-3">
                {getHighlightedText(item.type_value, searchValue)}
              </Typography.Paragraph>
              <Typography.Paragraph className="bg-transparent border-0 p-0 flex items-center leading-1 mb-0 mr-3">
                <svg
                  width="13"
                  height="16"
                  viewBox="0 0 18 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <g clipPath="url(#clip0_31_13108)">
                    <path
                      d="M3.4066 2.96875C3.07267 2.96875 2.79946 3.23594 2.79946 3.5625V15.4375C2.79946 15.7641 3.07267 16.0312 3.4066 16.0312H11.9066V13.0625C11.9066 12.4057 12.4492 11.875 13.1209 11.875H16.1566V3.5625C16.1566 3.23594 15.8834 2.96875 15.5495 2.96875H3.4066ZM11.9066 17.8125H3.4066C2.06709 17.8125 0.978027 16.7475 0.978027 15.4375V3.5625C0.978027 2.25254 2.06709 1.1875 3.4066 1.1875H15.5495C16.889 1.1875 17.978 2.25254 17.978 3.5625V11.875V12.0791C17.978 12.71 17.7238 13.3148 17.2684 13.7602L13.8343 17.1186C13.3789 17.5639 12.7604 17.8125 12.1153 17.8125H11.9066Z"
                      fill="#242B37"
                    />
                    <path
                      d="M9.88172 4.88394C9.8077 4.73405 9.65128 4.63867 9.47949 4.63867C9.3077 4.63867 9.15267 4.73405 9.07726 4.88394L8.17922 6.68667L6.17364 6.97555C6.00605 7.00007 5.86638 7.11453 5.81471 7.27123C5.76303 7.42793 5.80493 7.60099 5.92504 7.71681L7.38034 9.12166L7.03677 11.107C7.00883 11.2705 7.07867 11.4367 7.21693 11.5335C7.3552 11.6302 7.53816 11.6425 7.689 11.5648L9.48089 10.6314L11.2728 11.5648C11.4236 11.6425 11.6066 11.6316 11.7448 11.5335C11.8831 11.4354 11.9529 11.2705 11.925 11.107L11.58 9.12166L13.0353 7.71681C13.1554 7.60099 13.1987 7.42793 13.1457 7.27123C13.0926 7.11453 12.9543 7.00007 12.7867 6.97555L10.7798 6.68667L9.88172 4.88394Z"
                      fill="#242B37"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_31_13108">
                      <rect
                        width="17"
                        height="19"
                        fill="white"
                        transform="translate(0.978027)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                Topic:
                <Link href={`/${jsonData[0][1]?.camp_link}`}>
                  <a className="text-blue text-base font-inter font-medium hover:hblue ml-1">
                    {getHighlightedText(
                      jsonData?.[0]?.[1]?.topic_name,
                      searchValue
                    )}
                  </a>
                </Link>
              </Typography.Paragraph>
              {/* <div className="">
                {parsedData?.reverse()?.map((obj, index) => {
                  return (
                    <a href={`/${obj.camp_link}`} key={`/${obj.camp_link}`}>
                      {obj.camp_name}
                      {index < parsedData?.length - 1 ? "/ " : ""}
                    </a>
                  );
                })}
              </div> */}
            </div>
            <RightOutlined className="ml-auto" />
          </List.Item>
        );
      }}
    />
  </Card>
);

const NickNamesItems = ({ searchNickname, searchValue }) => (
  <Card
    className={`border-0 h-100 bg-gr ${styles.ItemCard}`}
    title="Nickname(s)"
  >
    <List
      size="small"
      dataSource={searchNickname?.slice(0, 5)}
      footer={
        searchNickname?.length ? (
          <span className={styles.bold_margin}></span>
        ) : null
      }
      renderItem={(item: any) => {
        return (
          <List.Item className="w-full flex font-medium items-start bg-white">
            <Link href={`/${item?.link}`}>
              <a className="flex justify-between w-full items-start">
                <span>
                  <UserOutlined />
                  {getHighlightedText(item.type_value, searchValue)}
                </span>
                <span className="ml_auto">
                  Supported camps:{" "}
                  <strong className="text-orange">
                    {item?.support_count == "" ? 0 : item?.support_count}
                  </strong>{" "}
                </span>
              </a>
            </Link>
          </List.Item>
        );
      }}
    />
  </Card>
);

const FooterItems = ({ searchValue, handleSearchfor }) => (
  <footer className="p-2 text-center">
    {/* <i className="icon-search"></i> */}
    <Link href={{ pathname: "/search", query: { q: searchValue } }}>
      <a
        onClick={() => handleSearchfor()}
        className="text-base font-inter font-semibold"
      >
        View All Results
      </a>
      {/* <a onClick={() => handleSearchfor()}>{`Search for "${
        searchValue.length > searchValueLength
          ? searchValue.substring(0, searchValueLength) + "..."
          : searchValue
      }"`}</a> */}
    </Link>
  </footer>
);
