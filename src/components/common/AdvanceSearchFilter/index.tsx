import { useRouter } from "next/router";
import {
  AutoComplete,
  Button,
  Collapse,
  Dropdown,
  Empty,
  Input,
  Popover,
  Radio,
  Select,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import styles from "./advanceSearchFilter.module.scss";
import { Fragment, useEffect, useMemo, useState } from "react";
import filter from "src/assets/image/filter.svg";
import upArrow from "src/assets/image/ant-design--caret-up-filled.svg";
import Image from "next/image";
import { LeftOutlined } from "@ant-design/icons";
import { CloseCircleOutlined, CaretDownOutlined } from "@ant-design/icons";
import { AdvanceFilterSeacrhApi } from "src/network/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import {
  setClickAdvanceFilterOption,
  setSearchQueryValue,
  setSelectNickNameIdFromDirectSupportTree,
  setSelectNicknameIdFromGetApi,
  setSelectedTopicFromAdvnaceFilterNickname,
} from "src/store/slices/searchSlice";
import debounce from "lodash/debounce";
import { getTreesApi } from "src/network/api/campDetailApi";

export default function AdvanceFilter() {
  const [searchVal, setSearchVal] = useState("");
  const [searchTopics, setSearchTopics] = useState([]);
  const [searchCamps, setSearchCamps] = useState([]);

  const { Panel } = Collapse;
  const { Title, Text, Paragraph } = Typography;
  const { Search } = Input;
  let {
    searchValue,
    searchQueryValue,
    supportTreeForCamp,
    asof,
    asofdate,
    algorithm,
    viewThisVersionCheck,
  } = useSelector((state: RootState) => ({
    searchValue: state?.searchSlice?.searchValue,
    searchQueryValue: state?.searchSlice?.searchQueryValue,
    campSupportingTree: supportTreeForCamp,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
  }));
  const { searchDataAll } = useSelector((state: RootState) => ({
    searchDataAll: state?.searchSlice?.searchDataAll,
  }));
  const findNicknameId = searchDataAll.nickname?.map((obj) => {
    return obj.id;
  });
  const extractNumbers = (dataArray) => {
    return dataArray?.map((item) => {
      // Split each string by hyphen
      const parts = item.split("-");
      // Return the second part which contains the number
      return parseInt(parts[1], 10);
    });
  };
  const dispatch = useDispatch();
  const router = useRouter();
  const handleItemClick = (topic) => {
    dispatch(setSelectedTopicFromAdvnaceFilterNickname([topic]));
  };

  const advanceFilter = async (body) => {
    const response = await AdvanceFilterSeacrhApi(body);
    if (response) {
      setSearchTopics(response.data.topic);
      setSearchCamps(response.data.camp);
    }
  };
  const reqBody = {
    type: router.pathname == "/search/nickname" ? "nickname" : "",
    search: searchValue,
    query: searchQueryValue,
    nick_ids: extractNumbers(findNicknameId),
  };
  const debounceFn = useMemo(() => debounce(advanceFilter, 500), []);

  const Highlighted = ({ text = "", highlight = "" }) => {
    if (!highlight.trim()) {
      return <label>{text}</label>;
    }
    const escapedHighlight = highlight.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    );
    const regex = new RegExp(`(${escapedHighlight})`, "gi");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark className={`${styles.highlighter} p-0`} key={i}>
              {part}
            </mark>
          ) : (
            <span
              style={{ cursor: "pointer", fontWeight: "bold" }}
              className={styles.highlighter}
              key={i}
            >
              {part}
            </span>
          )
        )}
      </>
    );
  };
  interface MyObjectType {
    camp_id?: string; // Define the structure of the object
    support_tree?: any; // Update 'any' with the correct type if possible
  }

  const getNicknameFromSupportTree = async (reqBodyForService, camp_num) => {
    const response = await getTreesApi(reqBodyForService);
    const treeData = response?.treeData;
    const children = treeData && treeData["1"] && treeData["1"].children;
    const getChildren = children
      ? Object.values(response?.treeData?.["1"]?.children).map((value:MyObjectType) => {
          return {
            campId: value?.camp_id,
            supportTree: value?.support_tree,
          };
        })
      : [];
    const supportTree = response?.treeData['1'].support_tree;
    const getNIcknameIdFromDirectSupportTree =supportTree.map((obj)=>{
      return obj.nick_name_id
    })
    const filtercampId = getChildren?.reduce((acc, obj) => {
        if (obj.campId === camp_num) {
            acc = obj.supportTree;
        }
        return acc;
    }, []);
    
    const getNickId = filtercampId?.map((obj) => {
      return obj.nick_name_id;
    });  
    dispatch(setSelectNicknameIdFromGetApi(getNickId));
    dispatch(setSelectNickNameIdFromDirectSupportTree(getNIcknameIdFromDirectSupportTree))
  };

  return (
    <div
      className={
        router?.pathname !== "/search/nickname"
          ? "advanceFilter"
          : "NicknameadvanceFilter advanceFilter"
      }
    >
      <Collapse
        className={`${styles.cardAccordian} topicListFilterCardCollapse`}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <CaretDownOutlined rotate={isActive ? 180 : 180} />
        )}
        bordered={false}
        // defaultActiveKey={["1", "2", "3"]}
        // accordion={searchVal ?false:true}
      >
        <Panel
          header={
            <span className="filter-heading">
              <Image
                id="viewFile"
                alt="Eye Image"
                src={filter}
                width={15}
                height={11}
              />
              Advance Filter
            </span>
          }
          key="1"
        >
          {/* <div className="advance_close">
            <CloseCircleOutlined />
          </div> */}

          {router?.pathname !== "/search/nickname" ? (
            <div className="row">
              <div className="col-sm-6">
                <h4>Canonizer</h4>
                <label>Canonizer Algorithm:</label>
                <Select className="w-100">
                  <Select.Option>123</Select.Option>
                </Select>
                <Link href={"#"}>
                  <a className="Algorithm">Algorithm Information</a>
                </Link>
                <div className="score-box">
                  <label>Score</label>

                  <LeftOutlined className={styles.LeftOutlined} />
                  <Input size="large" value={1} />
                  <Popover
                    content={"infoContent"}
                    placement="right"
                    className={styles.infoIcon}
                  >
                    <i className="icon-info"></i>
                  </Popover>
                </div>
              </div>
              <div className="col-sm-6">
                <h4>Search Type</h4>
                <Radio>Search include review</Radio>
                <Radio>Search live</Radio>
                <Radio>Search historical</Radio>
              </div>
            </div>
          ) : (
            <div className="nicknameAdvanceFilter">
              <label>Search for Topic or Camp </label>
              <Input
                size="large"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  dispatch(setSearchQueryValue(e.target.value));
                  reqBody.query = e.target.value;
                  debounceFn(reqBody);
                }}
                placeholder="Search a Keyword"
              />
              {searchTopics.length || searchCamps.length?<div className="advance_filter_dropdown">
                {searchVal ? (
                  <div className="search_outer">
                    {searchTopics.length ? (
                      <label>
                        <i className="icon-topic"></i>
                        <span>Topic</span>
                      </label>
                    ) : (
                      ""
                    )}
                    <div className={styles.search_list}>
                      <ul>
                        {searchTopics?.map((x: any) => {
                          {
                            const reqBodyForService = {
                              topic_num: x.topic_num,
                              camp_num: x.camp_num,
                              asOf: asof,
                              asofdate:
                                asof == "default" || asof == "review"
                                  ? Date.now() / 1000
                                  : asofdate,
                              algorithm: algorithm,
                              update_all: 1,
                              fetch_topic_history: viewThisVersionCheck
                                ? 1
                                : null,
                            };
                            return (
                              <>
                                <li style={{ cursor: "default" }}>
                                  <a
                                    onClick={() => {
                                      dispatch(
                                        setClickAdvanceFilterOption(true)
                                      );
                                      handleItemClick(x.title);
                                      getNicknameFromSupportTree(
                                        reqBodyForService,
                                        x.camp_num
                                      );
                                    }}
                                  >
                                    <Highlighted
                                      text={x.title}
                                      highlight={searchVal}
                                    />
                                  </a>
                                  {/* </Link> */}
                                </li>
                              </>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {searchVal ? (
                  <div className="search_outer">
                    {searchCamps.length ? (
                      <label>
                        <i className="icon-camp"></i>
                        <span>camp</span>
                      </label>
                    ) : (
                      ""
                    )}
                    <div className={styles.search_lists}>
                      <ul>
                        {searchCamps?.slice(0, 5)?.map((x) => {
                          const jsonData = JSON.parse(
                            x.breadcrumb
                          ) as Array<any>;
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
                            const reqBodyForService = {
                              topic_num: x.topic_num,
                              camp_num: x.camp_num,
                              asOf: asof,
                              asofdate:
                                asof == "default" || asof == "review"
                                  ? Date.now() / 1000
                                  : asofdate,
                              algorithm: algorithm,
                              update_all: 1,
                              fetch_topic_history: viewThisVersionCheck
                                ? 1
                                : null,
                            };
                            return (
                              <>
                                <li style={{ cursor: "default" }}>
                                  <a
                                    className={styles.camp_heading_color}
                                    onClick={() => {
                                      dispatch(
                                        setClickAdvanceFilterOption(true)
                                      );
                                      handleItemClick(x.title);
                                      getNicknameFromSupportTree(
                                        reqBodyForService,
                                        x.camp_num
                                      )                                     
                                    }}
                                  >
                                    {" "}
                                    <Highlighted
                                      text={x.title}
                                      highlight={searchVal}
                                    />
                                  </a>
                                  <div
                                    className={
                                      styles.tags_all_search_camp_statement
                                    }
                                  >
                                    {parsedData
                                      ?.reverse()
                                      ?.map((obj, index) => {
                                        return (
                                          <a
                                            href={`/${obj.camp_link}`}
                                            key={`/${obj.camp_link}`}
                                          >
                                            {obj.camp_name}
                                            {index < parsedData?.length - 1
                                              ? "/ "
                                              : ""}
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
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>:<div>
              {searchVal?<Empty description={"No data found"}/>:""}
                </div>}
            </div>
          )}
        </Panel>
      </Collapse>
    </div>
  );
}
