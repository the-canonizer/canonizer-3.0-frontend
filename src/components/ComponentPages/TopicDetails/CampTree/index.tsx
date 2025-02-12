import React, { useEffect, useState } from "react";
import { Tree, Tooltip, Popover } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { DownOutlined } from "@ant-design/icons";
import moment from "moment";

import styles from "../topicDetails.module.scss";

import useAuthentication from "src/hooks/isUserAuthenticated";
import { RootState } from "src/store";
import { setCurrentCamp } from "src/store/slices/filtersSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import ScoreTag from "components/ComponentPages/Home/TrandingTopic/scoreTag";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import { getCanonizedCampStatementApi } from "src/network/api/campDetailApi";
import { setStatementPreview } from "src/store/slices/topicSlice";

const { TreeNode } = Tree;

const CampTree = ({
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  prevTreeValueRef,
  isForumPage = false,
}: any) => {
  const {
    tree,
    filterByScore,
    review,
    is_checked,
    topicRecord,
    filterObject,
    viewThisVersion,
    is_camp_archive_checked,
    campRecord,
    treeExpandValue,
    asof,
    asofdate,
    haveStatementPreview,
  } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree,
    filterByScore: state.filters?.filterObject?.filterByScore,
    review: state?.filters?.filterObject?.asof,
    is_checked: state?.utils?.score_checkbox,
    topicRecord: state?.topicDetails?.currentTopicRecord,
    filterObject: state?.filters?.filterObject,
    viewThisVersion: state?.filters?.viewThisVersionCheck,
    is_camp_archive_checked: state?.utils?.archived_checkbox,
    campRecord: state?.topicDetails?.currentCampRecord,
    treeExpandValue: state?.filters?.treeExpandValue,
    asof: state?.filters?.filterObject?.asof,
    asofdate: state.filters?.filterObject?.asofdate,
    haveStatementPreview: state?.topic?.haveStatementPreview,
  }));

  let childExpandTree = [];
  const [defaultExpandKeys, setDefaultExpandKeys] = useState([]);
  const [uniqueKeys, setUniqueKeys] = useState([]);
  const [selectedExpand, setSelectedExpand] = useState([]);
  const [scoreFilter, setScoreFilter] = useState(filterByScore);
  const [includeReview, setIncludeReview] = useState(
    review == "review" ? true : false
  );
  const [showTree, setShowTree] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const onSelect = (
    selectedKeys,
    e: { selected; selectedNodes; node; event }
  ) => {
    let uniquekeyss = toFindDuplicates([...selectedKeys, ...uniqueKeys]);
    onExpand(uniquekeyss);
    if (!(selectedKeys.join() === "custom" || selectedKeys.join() === "")) {
      setSelectedExpand(selectedKeys);
      dispatch(setCurrentCamp(e?.selectedNodes[0]?.data));
      scrollToCampStatement();
    }
  };

  const { isUserAuthenticated, userID } = useAuthentication();

  const onTreePreviewStatementClick = (
    e: { preventDefault: () => void; stopPropagation: () => void },
    item: any
  ) => {
    e?.preventDefault();
    e?.stopPropagation();

    dispatch(setStatementPreview(item));

    const reqBody = {
      topic_num: +item?.topic_id,
      camp_num: +item?.camp_id,
      as_of: asof,
      as_of_date:
        asof == "default" || asof == "review"
          ? Date.now() / 1000
          : router?.query?.asofdate
          ? moment
              .utc(+router?.query?.asofdate * 1000)
              .format("DD-MM-YYYY H:mm:ss")
          : moment.utc(asofdate * 1000).format("DD-MM-YYYY H:mm:ss"),
    };

    getCanonizedCampStatementApi(reqBody);
  };

  const showSelectedCamp = (data, select_camp, campExist) => {
    Object?.keys(data).map((item) => {
      if (data[item].children) {
        if (data[item].score >= scoreFilter) {
          if (data[item]?.camp_id == select_camp) {
            setShowTree(true);

            return;
          }
          showSelectedCamp(data[item].children, select_camp, "");
        } else {
          return null;
        }
      }

      if (data[item]?.camp_id == select_camp) {
        setShowTree(true);
        return;
      }
    });
    if (campExist ? !campExist.camp_exist : false) {
      setShowTree(true);
    }
  };

  const getAllDefaultExpandKeys = (data, topic_score) => {
    if (data?.children) {
      Object?.keys(data?.children).map((item) => {
        if (
          (topic_score * treeExpandValue) / 100 <=
          data?.children[item]?.score
        ) {
          childExpandTree.push(data?.children[item]?.camp_id);
          getAllDefaultExpandKeys(data?.children[item], topic_score);
        } else return childExpandTree;
      });
    } else return childExpandTree;
    return childExpandTree;
  };

  const mergeArray = (arry1 = [], arry2 = []) => {
    const mergedSet = new Set([...arry1.map(String), ...arry2.map(String)]);
    const output = Array.from(mergedSet).sort((x, y) =>
      x.localeCompare(y, "en", { numeric: true })
    );
    return output;
  };

  useEffect(() => {
    setScoreFilter(filterByScore);
    setIncludeReview(review == "review" ? true : false);
  }, [filterByScore, review]);

  const dispatchData = (
    data,
    isDisabled = 0,
    isOneLevel = 0,
    isArchive = 0
  ) => {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i];
      const parentIsOneLevel = isOneLevel;
      let _isOneLevel = data[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
      let _isDisabled = data[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;
      let _isArchive = data[item].is_archive == 1 || isArchive == 1 ? 1 : 0;

      if (
        data[item].camp_id ===
        +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1)
      ) {
        dispatch(
          setCurrentCamp({
            ...data[item],
            parentIsOneLevel,
            _isDisabled,
            _isOneLevel,
            _isArchive,
          })
        );
        break;
      }
      if (data[item].children) {
        dispatchData(data[item].children, _isDisabled, _isOneLevel, _isArchive);
      }
    }
  };

  useEffect(() => {
    if (tree?.at(0) != null) {
      dispatchData(tree?.at(0));
    }
    let sesionexpandkeys = JSON.parse(sessionStorage.getItem("value")) || [];
    let keyexistSession =
      sesionexpandkeys &&
      tree?.at(0) &&
      sesionexpandkeys?.find(
        (age) => age.topic_id == tree?.at(0)["1"]?.topic_id
      );

    if (
      keyexistSession &&
      tree?.at(0) &&
      treeExpandValue == prevTreeValueRef?.current &&
      keyexistSession?.sessionexpandsKeys?.includes(
        String(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1)
      )
    ) {
      setDefaultExpandKeys(keyexistSession.sessionexpandsKeys);
      setUniqueKeys(keyexistSession.sessionexpandsKeys);
      setShowTree(true);
    } else {
      tree?.at(0) &&
        showSelectedCamp(
          tree?.at(0),
          +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
          tree?.at(1)
        );

      let expandKeys =
        tree?.at(0) &&
        getAllDefaultExpandKeys(tree?.at(0)["1"], tree?.at(0)["1"]?.score);

      tree?.at(0) &&
        expandKeys.push(+(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1));

      let allkeys = ["1", ...selectedExpand, ...(expandKeys || [])];
      let uniquekeyss = toFindDuplicates(allkeys);
      if (treeExpandValue == prevTreeValueRef?.current) {
        uniquekeyss = mergeArray(
          uniquekeyss,
          tree?.at(0)?.["1"]?.collapsedTreeCampIds
        );
      }
      setDefaultExpandKeys(expandKeys);
      setUniqueKeys(uniquekeyss);
      if (tree?.at(0)) {
        let index = sesionexpandkeys?.findIndex(
          (item) => item?.topic_id === tree?.at(0)["1"]?.topic_id
        );
        if (index !== -1) {
          sesionexpandkeys[index] = {
            topic_id: tree?.at(0)["1"]?.topic_id,
            sessionexpandsKeys: uniquekeyss,
          };
        } else {
          sesionexpandkeys.push({
            topic_id: tree?.at(0)["1"]?.topic_id,
            sessionexpandsKeys: uniquekeyss,
          });
        }
        sessionStorage.setItem("value", JSON.stringify(sesionexpandkeys));
      }
    }

    if (prevTreeValueRef !== undefined) {
      prevTreeValueRef.current = treeExpandValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree?.at(0), treeExpandValue]);

  const subScriptionStatus = (subscribedUsers: {}, data) => {
    return Object.keys(subscribedUsers).length > 0 &&
      Object.keys(subscribedUsers)?.includes(`${userID}`) ? (
      subscribedUsers[userID].explicit ? (
        <Tooltip
          title={
            topicRecord?.topicSubscriptionId &&
            (data?.title === topicRecord?.topic_name ||
              data?.review_title === topicRecord?.topic_name)
              ? "You have subscribed to the entire topic."
              : `You have subscribed to this camp.`
          }
          key="camp_subscribed_icon"
        >
          <i
            className={`icon-subscribe small text-xs text-primary ${styles.iconSubscribe}`}
          ></i>
        </Tooltip>
      ) : (
        <Tooltip
          title={`You are subscribed to ${
            subscribedUsers[userID].child_camp_name
              ? subscribedUsers[userID].child_camp_name
              : "child camp."
          }`}
        >
          <i
            className={`icon-subscribe small text-xs !text-canBlack !font-[300]  ${styles.implicitIcon}`}
          ></i>
        </Tooltip>
      )
    ) : null;
  };

  const isOnlyOneChild = (node) => {
    return node?.children && Object.keys(node.children).length === 1;
  };

  const isFirstChild = (data, item) => {
    const keys = Object.keys(data);
    return keys[0] === item.toString();
  };

  const isLastChild = (data, item) => {
    const keys = Object.keys(data);
    return keys[keys.length - 1] === item.toString();
  };

  const getURLParams = () => {
    const searchParams = new URLSearchParams();

    if (treeExpandValue && treeExpandValue != 10) {
      searchParams.append("filter", treeExpandValue.toString());
    }

    if (filterByScore && filterByScore != 0) {
      searchParams.append("score", filterByScore.toString());
    }

    if (filterObject?.algorithm !== "blind_popularity") {
      searchParams.append("algo", filterObject.algorithm);
    }

    if (filterObject?.asof && filterObject?.asof !== "default") {
      searchParams.append("asof", filterObject.asof);
    }

    if (filterObject?.asof === "bydate" && filterObject?.asofdate) {
      searchParams.append("asofdate", filterObject?.asofdate.toString());
    }

    if (filterObject?.namespace_id && filterObject?.namespace_id != 1) {
      searchParams.append("canon", filterObject.namespace_id.toString());
    }

    if (viewThisVersion) {
      searchParams.append("viewversion", "1");
    }

    return searchParams.toString();
  };

  const renderTreeNodes = (
    data: any,
    isDisabled = 0,
    isOneLevel = 0,
    isArchive = 0
  ) => {
    let sortedData = Object.keys(data)
      .map((key) => [Number(key), data[key]])
      .sort((a, b) => b[1].score - a[1].score);

    return sortedData.map((itemWithData) => {
      let item = itemWithData[0];

      const parentIsOneLevel = isOneLevel;
      let _isOneLevel = data[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
      let _isDisabled = data[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;
      let _isArchive = data[item].is_archive == 1 || isArchive == 1 ? 1 : 0;

      if (router?.query?.camp?.at(1)?.split("-")?.at(0)) {
        if (
          data[item]?.camp_id == router?.query?.camp?.at(1)?.split("-")?.at(0)
        ) {
          setSupportTreeForCamp(data[item].support_tree);
          is_checked && isUserAuthenticated
            ? setTotalCampScoreForSupportTree(data[item].full_score)
            : setTotalCampScoreForSupportTree(data[item].score);
        }
      } else {
        if (data[item]?.camp_id == 1) {
          setSupportTreeForCamp(data[item].support_tree);
          is_checked && isUserAuthenticated
            ? setTotalCampScoreForSupportTree(data[item].full_score)
            : setTotalCampScoreForSupportTree(data[item].score);
        }
      }

      const firstChild = isFirstChild(data, itemWithData[0]);
      const lastChild = isLastChild(data, itemWithData[0]);
      const onlyOneChild = isOnlyOneChild(item);

      const dynamicClasses = [
        firstChild ? "first-node-class" : "",
        lastChild ? "last-node-class" : "",
        onlyOneChild ? "only-one-child" : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (data[item].children) {
        if (data[item].score >= scoreFilter) {
          return data[item].is_archive == 0 ||
            (data[item].is_archive != 0 && is_camp_archive_checked == true) ? (
            <TreeNode
              className={`[&_.ant-tree-switcher]:!flex [&_.ant-tree-switcher]:!items-center [&_.ant-tree-node-content-wrapper]:hover:!bg-transparent [&_.ant-tree-switcher.ant-tree-switcher-noop>span]:!hidden [&_.ant-tree-node-content-wrapper]:py-1 ${dynamicClasses} treeHoover`}
              switcherIcon={({ expanded }) => {
                return data[item].camp_id ===
                  +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1) &&
                  _isDisabled == 0 &&
                  parentIsOneLevel == 0 &&
                  _isArchive == 0 &&
                  campRecord?.is_archive == 0 ? (
                  expanded ? (
                    <Image
                      className="rotate-180"
                      src="/images/tree-green-icon.svg"
                      width={16}
                      height={16}
                    />
                  ) : (
                    <Image
                      className=""
                      src="/images/tree-green-icon.svg"
                      width={16}
                      height={16}
                    />
                  )
                ) : expanded ? (
                  <Image
                    className=""
                    src="/images/tree-black-icon.svg"
                    width={16}
                    height={16}
                  />
                ) : (
                  <Image
                    className="-rotate-90"
                    src="/images/tree-black-icon.svg"
                    width={16}
                    height={16}
                  />
                );
              }}
              title={
                <div
                  style={{ overflowX: "auto", overflowY: "clip" }}
                  id={`camp-${data[item].camp_id}`}
                >
                  <div
                    className={
                      "treeListItem !my-0 flex items-center flex-wrap " +
                      styles.topicDetailsTreeListItem
                    }
                  >
                    <span
                      className={
                        "treeListItemTitle " +
                        styles.treeListItemTitle +
                        ` !text-sm !text-canBlack font-normal hover:!text-canblack  !break-all${
                          uniqueKeys.includes(data[item].camp_id.toString())
                            ? "!font-bold !break-all"
                            : ""
                        }`
                      }
                    >
                      <Link
                        href={`${
                          includeReview
                            ? isForumPage
                              ? data[item]?.review_link
                                  ?.replace("#statement", "")
                                  ?.replace("/topic/", "/forum/") + "/threads"
                              : data[item]?.review_link?.replace(
                                  "#statement",
                                  ""
                                )
                            : isForumPage
                            ? data[item]?.link
                                ?.replace("#statement", "")
                                ?.replace("/topic/", "/forum/") + "/threads"
                            : data[item]?.link?.replace("#statement", "")
                        }?${getURLParams()}`}
                      >
                        <a
                          className={`${
                            data[item].is_archive == 1
                              ? `font-bold !text-canBlack hover:!text-canBlack !break-all"  ${styles.archive_grey}`
                              : !isForumPage &&
                                (data[item]?.camp_id ==
                                  router?.query?.camp
                                    ?.at(1)
                                    ?.split("-")
                                    ?.at(0) ??
                                  "1")
                              ? `font-weight-bold text-sm hover:!text-canBlack !break-all"  ${styles.activeCamp}`
                              : " hover:!text-canBlack !break-all"
                          } ${
                            isForumPage &&
                            data[item]?.camp_id ==
                              ((router?.query?.camp as string)
                                ?.split("-")
                                ?.at(0) ?? "1")
                              ? `font-weight-bold forumActive ${styles.activeCamp}`
                              : ""
                          } ${
                            data[item].camp_id ===
                              +(
                                router?.query?.camp?.at(1)?.split("-")?.at(0) ??
                                1
                              ) &&
                            _isArchive == 0 &&
                            campRecord?.is_archive == 0
                              ? `!text-canGreen font-semibold text-sm`
                              : ""
                          } ${
                            haveStatementPreview?.camp_id === data[item].camp_id
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          {data[item].is_archive == 1 ? (
                            <Popover content="Archived Camp">
                              {includeReview
                                ? data[item]?.review_title
                                : data[item].camp_id === 1
                                ? "Agreement"
                                : data[item]?.title}
                            </Popover>
                          ) : data[item].camp_id === 1 ? (
                            "Agreement"
                          ) : (
                            data[item]?.title
                          )}
                        </a>
                      </Link>{" "}
                    </span>
                    <span className={styles.subScriptionIcon}>
                      {isUserAuthenticated &&
                        subScriptionStatus(
                          data[item].subscribed_users,
                          data[item]
                        )}
                    </span>
                    {tree && tree?.["0"]?.["1"]?.rank_hidden == undefined && (
                      <ScoreTag
                        topic_score={
                          is_checked
                            ? data[item]?.full_score
                            : data[item]?.score
                        }
                        hideRank={tree && tree?.["0"]?.["1"]?.rank_hidden}
                      />
                    )}
                    <SecondaryButton
                      onClick={(e) =>
                        onTreePreviewStatementClick(e, data[item])
                      }
                      className={`!text-canBlue hover:!text-canHoverBlue !text-[12px] !font-semibold !bg-transparent !border-0 !p-0 !shadow-none ml-4 previewBTN opacity-0 invisible ${
                        haveStatementPreview?.camp_id === data[item].camp_id
                          ? "!pointer-events-none !opacity-0 !invisible !cursor-default"
                          : ""
                      }`}
                    >
                      Preview Statement
                    </SecondaryButton>
                  </div>
                </div>
              }
              key={data[item].camp_id}
              data={{
                ...data[item],
                parentIsOneLevel,
                _isDisabled,
                _isOneLevel,
                _isArchive,
              }}
            >
              {data[item].camp_id ===
                +(Array.isArray(router?.query?.camp)
                  ? router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1
                  : (router?.query?.camp as string)?.split("-")?.at(0) ?? 1) &&
                _isDisabled == 0 &&
                parentIsOneLevel == 0 &&
                _isArchive == 0 &&
                campRecord?.is_archive == 0 && (
                  <TreeNode
                    key={"custom"}
                    title={
                      <p className={styles.startNew}>
                        <Link
                          href={{
                            pathname: `/camp/create/${replaceSpecialCharacters(
                              Array.isArray(router?.query?.camp)
                                ? router?.query.camp[0]
                                : (router?.query?.topic as string),
                              "-"
                            )}/${
                              router?.query.camp[1]
                                ? replaceSpecialCharacters(
                                    router?.query.camp[1],
                                    "-"
                                  )
                                : 1
                            }`,
                          }}
                        >
                          <a className="!text-canGreen font-semibold italic text-sm">
                            {/* <Image
                              src="/images/start-new-tree.svg"
                              width={16}
                              height={17}
                            /> */}
                            {`Start new`}{" "}
                          </a>
                        </Link>
                      </p>
                    }
                  />
                )}

              {renderTreeNodes(
                data[item].children,
                _isDisabled,
                _isOneLevel,
                _isArchive
              )}
            </TreeNode>
          ) : null;
        } else {
          return null;
        }
      }
      return <TreeNode key={data[item].key} {...data[item]} />;
    });
  };

  const onExpand = (expandedKeyss) => {
    let expandedKeys = toFindDuplicates(expandedKeyss);
    let topic_id = tree?.at(0) && tree?.at(0)["1"].topic_id;
    let sesionexpandkeys = JSON.parse(sessionStorage.getItem("value"));

    let sesionExpandnewKeys = sesionexpandkeys.map((keys) => {
      if (keys.topic_id == topic_id) {
        return { topic_id: topic_id, sessionexpandsKeys: expandedKeys };
      } else {
        return keys;
      }
    });

    sessionStorage.setItem("value", JSON.stringify(sesionExpandnewKeys));
    setUniqueKeys(expandedKeys);
  };

  const toFindDuplicates = (arry) => {
    let uniqueArray = arry.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
    let uniqueArraytoString = uniqueArray.map(String);
    return uniqueArraytoString;
  };

  let treeContent;

  if (tree?.at(0)) {
    if (
      (showTree && tree?.at(0)["1"]?.title != "" && defaultExpandKeys) ||
      isForumPage
    ) {
      treeContent = (
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          onSelect={onSelect}
          onExpand={onExpand}
          expandedKeys={[...uniqueKeys]}
          data-testid="camp-tree"
        >
          {tree?.at(0) && renderTreeNodes(tree?.at(0))}
        </Tree>
      );
    } else {
      treeContent = null;
    }
  } else {
    treeContent = <p data-testid="camp-tree">No Camp Tree Found</p>;
  }

  return treeContent;
};

export default CampTree;
