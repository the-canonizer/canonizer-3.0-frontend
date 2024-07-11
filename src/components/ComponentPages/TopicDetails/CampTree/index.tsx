import React, { useEffect, useState } from "react";
import { Tree, Tooltip, Popover, Typography, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ProgressBar from "@ramonak/react-progress-bar";

import styles from "../topicDetails.module.scss";

import useAuthentication from "src/hooks/isUserAuthenticated";
import { RootState } from "../../../../store";
import { setCurrentCamp } from "../../../../store/slices/filtersSlice";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import {
  setCampSupportingTree,
  setCheckSupportExistsData,
  setCurrentCheckSupportStatus,
} from "src/store/slices/campDetailSlice";
import { DownOutlined } from "@ant-design/icons";
import Image from "next/image";
import arrow from "../../../../../public/images/caret-icon.svg"

const { TreeNode } = Tree;

const CampTree = ({
  scrollToCampStatement,
  setTotalCampScoreForSupportTree,
  setSupportTreeForCamp,
  treeExpandValue,
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
  }));
  let childExpandTree = [];
  const [defaultExpandKeys, setDefaultExpandKeys] = useState([]);
  const [uniqueKeys, setUniqueKeys] = useState([]);
  const [showScoreBars, setShowScoreBars] = useState(false);
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
          (item) => item.topic_id === tree?.at(0)["1"]?.topic_id
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
    if (tree?.at(0)) {
      const agreementCamp = tree?.at(0)[1]?.score;
      if (
        agreementCamp > 5 &&
        Object.keys(tree?.at(0)[1].children).length > 0
      ) {
        setShowScoreBars(true);
      } else {
        setShowScoreBars(false);
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
          // title="You have subscribed to the entire topic."
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
            className={`icon-subscribe text-primary ${styles.iconSubscribe}`}
          ></i>
        </Tooltip>
      ) : (
        <Tooltip
          title={`You are subscribed to ${
            subscribedUsers[userID].child_camp_name
              ? subscribedUsers[userID].child_camp_name
              : "child camp."
          }`}
          // title="You have subscribed to the entire topic."
        >
          <i
            className={`icon-subscribe text-secondary  ${styles.implicitIcon}`}
          ></i>
        </Tooltip>
      )
    ) : null;
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

      if (data[item].children) {
        if (data[item].score >= scoreFilter) {
          return data[item].is_archive == 0 ||
            (data[item].is_archive != 0 && is_camp_archive_checked == true) ? (
            <>
              <TreeNode
                switcherIcon={<Image src={arrow} height={10} width={10} />}
                title={
                  <div
                    style={{ overflowX: "auto", overflowY: "clip" }}
                    id={`camp-${data[item].camp_id}`}
                  >
                    <div
                      className={
                        "treeListItem !my-2.5 " + styles.topicDetailsTreeListItem
                      }
                    >
                      <span
                        className={
                          "treeListItemTitle " + styles.treeListItemTitle
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
                          }?filter=${treeExpandValue}&score=${filterByScore}&algo=${
                            filterObject?.algorithm
                          }${
                            filterObject?.asof == "bydate"
                              ? "&asofdate=" + filterObject?.asofdate
                              : ""
                          }&asof=${filterObject?.asof}&canon=${
                            filterObject?.namespace_id
                          }${viewThisVersion ? "&viewversion=1" : ""}`}
                        >
                          <a
                            className={`${
                              data[item].is_archive == 1
                                ? `font-weight-bold tra !text-canBlack ${styles.archive_grey}`
                                : !isForumPage &&
                                  (data[item]?.camp_id ==
                                    router?.query?.camp
                                      ?.at(1)
                                      ?.split("-")
                                      ?.at(0) ??
                                    "1")
                                ? `font-weight-bold ${styles.activeCamp}`
                                : ""
                            } ${
                              isForumPage &&
                              data[item]?.camp_id ==
                                ((router?.query?.camp as string)
                                  ?.split("-")
                                  ?.at(0) ?? "1")
                                ? `font-weight-bold forumActive ${styles.activeCamp}`
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
                            ) : includeReview ? (
                              data[item]?.review_title
                            ) : data[item].camp_id === 1 ? (
                              "Agreement"
                            ) : (
                              data[item]?.title
                            )}
                          </a>
                        </Link>{" "}
                        {/* {data[item].is_archive == 1 ? (
                          <Image
                            src={Archive_icon.src}
                            width={20}
                            height={20}
                            alt="archive"
                            preview={false}
                          />
                        ) : (
                          ""
                        )} */}
                      </span>
                      <span className={styles.subScriptionIcon}>
                        {isUserAuthenticated &&
                          subScriptionStatus(
                            data[item].subscribed_users,
                            data[item]
                          )}
                      </span>
                      <span className="bg-canOrange p-1 rounded-md flex items-center gap-1">
                        {/* <ProgressBar
                          completed={77}
                          animateOnRender={true}
                          className="progress-bar"
                          width={String(
                            showScoreBars
                              ? (data[item].score * 460) /
                                  tree?.at(0)["1"].score +
                                  50 +
                                  "px"
                              : `${
                                  (is_checked
                                    ? data[item].full_score?.toFixed(2)
                                    : data[item].score?.toFixed(2)
                                  ).length * 11
                                }px`
                          )}
                          baseBgColor={"#fff"}
                          labelAlignment={"left"}
                          bgColor={"#f89d15"}
                          borderRadius={"2px"}
                          height="16px"
                          customLabel={
                            is_checked
                              ? data[item].full_score?.toFixed(2)
                              : data[item].score?.toFixed(2)
                          }
                        /> */}
                        
                        <Image
                          src="/images/hand-icon.svg"
                          alt="svg"
                          height={10}
                          width={8}
                        />
                       <span className="text-xs text-white"> { is_checked
                              ? data[item].full_score?.toFixed(2)
                              : data[item].score?.toFixed(2)
                          }</span>
                      </span>
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
                  +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1) &&
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
                                router?.query.camp[0],
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
                            <a>{`<Start new supporting camp here>`} </a>
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
            </>
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

    // setAutoExpandParent(false);
  };

  const toFindDuplicates = (arry) => {
    let uniqueArray = arry.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
    let uniqueArraytoString = uniqueArray.map(String);
    return uniqueArraytoString;
  };
  const eventLinePath = () => {
    router?.push(router?.asPath.replace("topic", "eventline"));
  };

  return tree?.at(0) ? (
    (showTree && tree?.at(0)["1"]?.title != "" && defaultExpandKeys) ||
    isForumPage ? (
      <>
        <Typography.Paragraph
          className={`${styles.topicTitleStyle} ${styles.topicTitle}`}
        >
          {/* <div className="event-line-wrapper">
            <div>
              <span className="normal">Topic : </span>
              {tree?.length && tree[0] ? (
                <Link
                  href={`${includeReview
                      ? isForumPage
                        ? tree[0]["1"]?.review_link
                          ?.replace("#statement", "")
                          ?.replace("/topic/", "/forum/") + "/threads"
                        : tree[0]["1"]?.review_link?.replace("#statement", "")
                      : isForumPage
                        ? tree[0]["1"]?.link
                          ?.replace("#statement", "")
                          ?.replace("/topic/", "/forum/") + "/threads"
                        : tree[0]["1"]?.link?.replace("#statement", "")
                    }?filter=${treeExpandValue}&score=${filterByScore}&algo=${filterObject?.algorithm
                    }${filterObject?.asof == "bydate"
                      ? "&asofdate=" + filterObject?.asofdate
                      : ""
                    }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${viewThisVersion ? "&viewversion=1" : ""
                    }`}
                  className={styles.boldBreadcrumb}
                  replace
                >
                  <a
                    className={`${tree[0]["1"].is_archive == 1
                        ? `font-weight-bold tra ${styles.archive_grey}`
                        : tree[0]["1"]?.camp_id ==
                          router?.query?.camp?.at(1)?.split("-")?.at(0) ?? "1"
                          ? `font-weight-bold ${styles.activeCamp}`
                          : ""
                      } ${isForumPage &&
                        tree[0]["1"]?.camp_id ==
                        ((router?.query?.camp as string)?.split("-")?.at(0) ?? "1")
                        ? `font-weight-bold forumActive ${styles.activeCamp}`
                        : ""
                      }`}
                  >
                    {tree[0]["1"].is_archive == 1 ? (
                      <Popover content="Archived Camp">
                        {includeReview
                          ? tree[0]["1"]?.review_title
                          : tree[0]["1"]?.title}
                      </Popover>
                    ) : includeReview ? (
                      tree[0]["1"]?.review_title
                    ) : (
                      tree[0]["1"]?.title
                    )}
                  </a>
                </Link>
              ) : (
                ""
              )}{" "}

            </div>
            <Button
              type="primary"
              size="small"
              onClick={eventLinePath}
              className={styles.btnCampForum}
              id="camp-forum-btn"
            >
              Event Line
            </Button>
          </div> */}
          <span className={styles.subScriptionIcon}>
            {isUserAuthenticated && !!topicRecord?.topicSubscriptionId ? (
              <Tooltip
                title="You have subscribed to the entire topic."
                key="camp_subscribed_icon"
              >
                <small style={{ alignSelf: "center", marginLeft: "10px" }}>
                  <i className="icon-subscribe text-primary"></i>
                </small>
              </Tooltip>
            ) : (
              ""
            )}
          </span>
        </Typography.Paragraph>
        <Tree
          showLine={{ showLeafIcon: false }}
          onSelect={onSelect}
          onExpand={onExpand}
          expandedKeys={[...uniqueKeys]}
          data-testid="camp-tree"
        >
          {tree?.at(0) && renderTreeNodes(tree?.at(0))}
        </Tree>
      </>
    ) : null
  ) : (
    <p data-testid="camp-tree">No Camp Tree Found</p>
  );
};

export default CampTree;
