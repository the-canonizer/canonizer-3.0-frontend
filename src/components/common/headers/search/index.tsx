import React, { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import {
  AutoComplete,
  Card,
  Empty,
  Input,
  List,
  Popover,
  Typography,
} from "antd";
import { EyeOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";

import type { TabsProps } from "antd";

import styles from "./search.module.scss";

import { RootState } from "src/store";
import queryParams from "src/utils/queryParams";
import { globalSearchCanonizer } from "src/network/api/userApi";
import {
  setSearchData,
  setSearchMetaData,
  setSearchValue,
  setSearchDataAll,
  setOpenSearchForMobileView,
  setSearchCountForMetaData,
} from "src/store/slices/searchSlice";
import CustomSkelton from "../../customSkelton";
import { setSearchLoadingAction } from "src/store/slices/loading";
import SearchInputs from "components/shared/FormInputs/search";
import CustomTabs from "components/shared/Tabs";

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

const getHighlightedTextForCampStatement = (text, highlight) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, i) => (
        <div
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { fontWeight: "bold" }
              : {}
          }
        >
          <div className="" dangerouslySetInnerHTML={{ __html: part }}></div>
        </div>
      ))}{" "}
    </>
  );
};

function replaceSpecialCharactersInLink(link) {
  return link.replace(/[-\\^$*+?.()|%#|[\]{}@]/g, "-");
}

const renderItem = (title: any) => ({
  value: title,
  label: <div className="titleDiv ">{title}</div>,
});

const advanceSearchValueLength = 100;

const HeaderSearch = ({ className = "" }: any) => {
  const router = useRouter(),
    dispatch = useDispatch();

  let { searchValue, pageNumber, openSearchForMobileView } = useSelector(
    (state: RootState) => ({
      searchValue: state?.searchSlice?.searchValue,
      pageNumber: state?.searchSlice?.pageNumber,
      openSearchForMobileView: state?.searchSlice?.openSearchForMobileView,
    })
  );

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
            className="text-sm font-normal font-inter"
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
      options: [
        renderItem(
          showEmpty(
            "No results found. Try searching by using a different keyword."
          )
        ),
      ],
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
  const { Search } = Input;
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
      // dispatch(setSearchMetaData(response?.data?.meta_data));
      if (
        router.pathname == "/search/topic" ||
        router.pathname == "/search/camp" ||
        router.pathname == "/search/camp_statement" ||
        router.pathname == "/search/nickname"
      ) {
        dispatch(setSearchMetaData(response?.data?.meta_data));

        dispatch(setSearchDataAll(response?.data?.data));
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
      dispatch(setSearchCountForMetaData(response?.data?.meta_data));
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
      <AutoComplete
        popupClassName={`w-full lg:!w-[54rem] bg-white pt-6 rounded-lg [&_.ant-tabs-nav]:mb-10 [&_.ant-tabs-nav-wrap]:px-12  [&_.ant-select-item-option-content]:!bg-white [&_.ant-select-item-option-grouped]:!bg-white [&_.ant-select-item-option-content]:!px-6 [&_>div]:w-full [&_.ant-select-item-option-grouped]:!px-0 [&_.ant-tabs-tab-btn]:!text-base [&_.ant-tabs-nav-list]:gap-12 [&_.ant-tabs-tab-btn]:!font-normal [&_.ant-tabs-tab-active>div]:!font-semibold [&_.ant-tabs-tab]:!ml-0 [&_.ant-tabs-ink-bar]:!border-b-4 [&_.ant-tabs-ink-bar]:!border-canBlue [&_.ant-tabs-ink-bar]:!rounded-tl-full  [&_.ant-tabs-ink-bar]:!rounded-tr-full  lg:[&_.ant-tabs-ink-bar]:!h-1 [&_.ant-tabs-ink-bar]:!h-1 [&_.ant-tabs-tab-active>div]:!shadow-none [&_.ant-card-head-title]:!font-semibold [&_.ant-tabs-nav-list]:!w-full ${styles.searchCategories} `}
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
        onFocus={(e) => {
          setIsFullWidth(true);
        }}
        onBlur={(e) => {
          setIsFullWidth(false);
        }}
        className={`lg:ml-5 transition-all delay-300 [&>div]:!border-0 w-full tab:w-4/12 xl:w-2/5`}
      >
        <div className={`items-center !hidden lg:!flex ${className}  `}>
          <SearchInputs
            placeholder="Search via keyword"
            value={
              searchVal.length > advanceSearchValueLength
                ? searchVal.substring(0, advanceSearchValueLength)
                : searchVal
            }
            className={`${styles.searchInput} text-medium font-medium [&_.ant-input]:!shadow-none [&_.ant-input]:!border-canGrey2 hover:!border-canGrey2 searchInputHeader`}
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
      <div className=" lg:hidden flex items-center justify-end absolute  py-2">
        <AutoComplete
          popupClassName={`[&_.ant-select-item-option-active]:!bg-white !top-26 !shadow-none [&_.ant-select-item-option-grouped]:!px-0 ${styles.searchCategories} [&_.ant-tabs-nav-list]:!gap-5  [&_.ant-tabs-tab]:m-0 [&_.ant-tabs-tab]:gap-8 w-full [&_.ant-tabs-tab]:px-3 [&_.ant-tabs-nav]:!mb-8 [&_.ant-tabs-tab-btn]:text-base [&_.ant-tabs-tab-btn]:font-normal `}
          dropdownMatchSelectWidth={false}
          open={false}
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
          className={`flex w-full [&_.ant-tabs-nav-list]:!w-full transition-all delay-300 [&>div]:!border-0 bg-white`}
        >
          <div className="w-full flex bg-white gap-3">
            {openSearchForMobileView ? (
              <>
                <div
                  className="flex items-center"
                  onClick={() => {
                    dispatch(setOpenSearchForMobileView(false));
                  }}
                >
                  <Image
                    src="/images/recent-activiity-arrow.svg"
                    width={20}
                    height={20}
                    alt={"check"}
                  />
                </div>
                <SearchInputs
                  placeholder="Search via keyword"
                  value={
                    searchVal.length > advanceSearchValueLength
                      ? searchVal.substring(0, advanceSearchValueLength)
                      : searchVal
                  }
                  className={`${styles.searchInput} [&_.ant-btn-primary]:!bg-transparent [&_.ant-btn-primary]:!border-canGrey2 w-full text-medium font-medium [&_.ant-input]:!shadow-none [&_.ant-input]:!border-canGrey2 hover:!border-canGrey2 [&_.ant-btn-primary]:!rounded-tr-lg [&_.ant-btn-primary]:!rounded-br-lg searchInputHeader`}
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
              </>
            ) : null}
          </div>
        </AutoComplete>
      </div>
      <div className="flex items-center absolute right-8">
        {!openSearchForMobileView ? (
          <Image
            src="/images/mobile-header-icon.svg"
            width={24}
            height={24}
            onClick={() => {
              dispatch(setOpenSearchForMobileView(!openSearchForMobileView));
            }}
          />
        ) : null}
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
  <Card
    className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:!font-semibold [&_.ant-card-head-title]:uppercase border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5 lg:px-6 px-4  ${styles.ItemCard}`}
    title="Topic(s)"
  >
    <List
      size="small"
      className=""
      dataSource={searchTopics?.slice(0, 5)}
      footer={
        searchTopics?.length ? <span className={styles.bold_margin}></span> : ""
      }
      renderItem={(item: any) => (
        <List.Item className="w-full flex font-medium !border-b !border-canGrey2 !py-3 lg:!py-3.5 !px-0 first:!pt-0 last:!border-none ">
          <Link
            className="!font-semibold"
            href={`/${replaceSpecialCharactersInLink(item.link)}`}
          >
            <a className="flex justify-between w-full items-start">
              <span className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="flex-1 text-base lg:font-medium font-normal text-canBlack mb-2 flex">
                    {getHighlightedText(item.type_value, searchValue)}
                  </span>

                  <RightOutlined className="ml-auto" />
                </div>
                <div className="text-left flex gap-7">
                  <Popover content="Share Topic" placement="top">
                    <Typography.Paragraph className="bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent flex gap-1.5 items-center leading-1 !mb-0 ">
                      {/* <FlagOutlined className="text-canBlack p-1 text-medium" /> */}
                      <Image
                        src="/images/serach-flag.svg"
                        width={18}
                        height={20}
                      />
                      <Link href="">
                        <a className="text-canBlue text-base font-inter font-normal lg:font-medium">
                          General
                        </a>
                      </Link>
                    </Typography.Paragraph>
                  </Popover>
                  <Typography.Paragraph className="!m-0 text-canBlack font-medium font-inter text-base flex items-center">
                    <EyeOutlined className="text-canBlack p-1 text-medium" />{" "}
                    123
                  </Typography.Paragraph>
                </div>
              </span>
            </a>
          </Link>
        </List.Item>
      )}
    />
  </Card>
);

const CampItems = ({ searchCamps, searchValue }) => (
  <Card
    className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:uppercase [&_.ant-card-head-title]:!font-semibold border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5  lg:px-6 px-4  ${styles.ItemCard}`}
    title="Camp(s)"
  >
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
          <List.Item className="w-full flex font-medium !border-b !border-canGrey2 !py-3.5 !px-0 first:!pt-0">
            <Link href={`/${jsonData[0][1]?.camp_link}`}>
              <a className="flex justify-between w-full items-start">
                <span className="flex flex-col w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex-1 text-base font-medium text-canBlack mb-2 flex">
                      {" "}
                      {getHighlightedText(item.type_value, searchValue)}
                    </span>
                    <RightOutlined className="ml-auto" />
                  </div>

                  <div className="text-left flex">
                    <Typography.Paragraph className="text-base font-medium bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent   flex gap-1.5 items-center leading-1 !mb-0">
                      <Image
                        src="/images/camp-search-icon.svg"
                        width={17}
                        height={19}
                      />
                      Topic:
                      <Link href="">
                        <a className="text-canBlue !text-base font-inter font-medium capitalize">
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
          </List.Item>
        );
      }}
    />
  </Card>
);

const CampStatementsItems = ({ searchCampStatement, searchValue }) => (
  <Card
    className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:uppercase [&_.ant-card-head-title]:!font-semibold border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5  lg:px-6 px-4 ${styles.ItemCard}`}
    title="Camp Statement(s)"
  >
    <List
      className="[&_.ant-list-footer]:!hidden"
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
          <List.Item className="w-full flex font-medium !border-b !border-canGrey2 !py-3.5 !px-0 first:!pt-0 last:!border-none last:!pb-0 ">
            <div className="">
              <Typography.Paragraph className="bg-transparent border-0 p-0 flex items-center leading-1 mb-2 [&_span]:inline-flex">
                <Link href={`/${jsonData[0][1]?.camp_link}`}>
                  <a className="flex w-full items-start !text-canBlack text-base font-medium">
                    {getHighlightedTextForCampStatement(
                      jsonData?.[0]?.[1]?.camp_name,
                      searchValue
                    )}
                  </a>
                </Link>
              </Typography.Paragraph>
              {/* <Typography.Paragraph className="bg-transparent border-0 p-0 inline-flex items-center leading-1 [&_span]:!inline-flex">
                {getHighlightedTextForCampStatement(item.type_value, searchValue)}
              </Typography.Paragraph> */}

              {getHighlightedTextForCampStatement(item.type_value, searchValue)}

              <div className="text-left flex">
                <Typography.Paragraph className="text-base font-medium bg-transparent border-0 p-0 hover:bg-transparent focus:bg-transparent   flex gap-1.5 items-center leading-1 !mb-0">
                  <Image
                    src="/images/camp-search-icon.svg"
                    width={17}
                    height={19}
                  />
                  Topic:
                  <Link href={`/${jsonData[0][1]?.camp_link}`}>
                    <a className="text-canBlue text-base font-inter font-medium ">
                      {getHighlightedText(
                        jsonData?.[0]?.[1]?.topic_name,
                        searchValue
                      )}
                    </a>
                  </Link>
                </Typography.Paragraph>
              </div>
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
    className={`[&_.ant-empty-normal]:!m-0 [&_.ant-list-empty-text]:!p-0 [&_.ant-card-head-title]:uppercase [&_.ant-card-head-title]:!font-semibold border-0 h-100 bg-canGray lg:rounded-xl [&_.ant-card-head-wrapper]:mb-6 [&_.ant-card-head-title]:!p-0 [&_.ant-card-head]:!p-0  [&_.ant-card-body]:!p-0 py-5  lg:px-6 px-4 ${styles.ItemCard}`}
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
          <List.Item className="w-full flex !border-none !py-2 lg:!px-5 !px-2.5 bg-white rounded-lg mb-2">
            <Link href={`/${item?.link}`}>
              <a className="flex justify-between w-full items-start">
                <span className="flex items-center gap-3.5 text-base font-normal">
                  {/* <UserOutlined /> */}
                  <Image
                    src="/images/nickname-user-icon.svg"
                    width={14}
                    height={16}
                  />
                  {getHighlightedText(item.type_value, searchValue)}
                </span>
                <span className="ml_auto text-base font-normal">
                  Supported camps:{" "}
                  <strong className="text-canOrange text-base !font-normal">
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
  <footer className="px-2 pt-5 mt-5 pb-5 text-center lg:border-t lg:border-canGrey2">
    {/* <i className="icon-search"></i> */}
    <Link
      href={{ pathname: "/search", query: { q: searchValue } }}
      className="[&_.ant-select-item-option-active]:!bg-white [&_.ant-select-item]:!p-0 [&_.ant-select-item-option]:!p-0 [&_.ant-select-item-option-grouped]:!p-0 "
    >
      <a
        onClick={() => handleSearchfor()}
        className="text-base uppercase font-inter font-semibold text-canBlack !p-0"
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
