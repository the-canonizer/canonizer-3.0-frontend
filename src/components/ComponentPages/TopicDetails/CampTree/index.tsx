import React, { useEffect, useState } from "react";
import { Tree, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../topicDetails.module.scss";

import { setCurrentCamp } from "../../../../store/slices/filtersSlice";
import { replaceSpecialCharacters } from "../../../../utils/generalUtility";
import useAuthentication from "src/hooks/isUserAuthenticated";

const { TreeNode } = Tree;

const CampTree = ({ scrollToCampStatement }) => {
  const { tree, filterByScore, review, is_checked } = useSelector(
    (state: RootState) => ({
      tree: state?.topicDetails?.tree,
      filterByScore: state.filters?.filterObject?.filterByScore,
      review: state?.filters?.filterObject?.asof,
      is_checked: state?.utils?.score_checkbox,
    })
  );

  const [selectedNodeID, setSelectedNodeID] = useState(1);
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
    if (selectedKeys.join() === "custom" || selectedKeys.join() === "") {
    } else {
      dispatch(setCurrentCamp(e?.selectedNodes[0]?.data));
      setSelectedNodeID(+selectedKeys.join(""));
      scrollToCampStatement();
    }
  };
  const { isUserAuthenticated, userID } = useAuthentication();

  const showSelectedCamp = (data, select_camp, campExist) => {
    let a = Object?.keys(data).map((item) => {
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
  useEffect(() => {
    setScoreFilter(filterByScore);
    setIncludeReview(review == "review" ? true : false);

    tree?.at(0) &&
      showSelectedCamp(
        tree?.at(0),
        +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
        tree?.at(1)
      );
  }, [filterByScore, review]);

  const dispatchData = (data, isDisabled = 0, isOneLevel = 0) => {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i];
      const parentIsOneLevel = isOneLevel;
      let _isOneLevel = data[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
      let _isDisabled = data[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;

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
          })
        );
        break;
      }
      if (data[item].children) {
        dispatchData(data[item], _isDisabled, _isOneLevel);
      }
    }
  };

  useEffect(() => {
    if (tree?.at(0) != null) {
      dispatchData(tree?.at(0));
    }
    tree?.at(0) &&
      showSelectedCamp(
        tree?.at(0),
        +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
        tree?.at(1)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree?.at(0)]);

  const subScriptionStatus = (subscribedUsers: {}) => {
    return Object.keys(subscribedUsers).length > 0 &&
      Object.keys(subscribedUsers)?.includes(`${userID}`) ? (
      subscribedUsers[userID].explicit ? (
        <i className={`icon-subscribe ${"text-primary"}`}></i>
      ) : (
        <Tooltip
          title={`You are subscribed to ${
            subscribedUsers[userID].child_camp_name
              ? subscribedUsers[userID].child_camp_name
              : "child camp"
          }`}
        >
          <i
            className={`icon-subscribe text-secondary  ${styles.implicitIcon}`}
          ></i>
        </Tooltip>
      )
    ) : null;
  };

  const renderTreeNodes = (data: any, isDisabled = 0, isOneLevel = 0) => {
    let sortedData = Object.keys(data)
      .map((key) => [Number(key), data[key]])
      .sort((a, b) => b[1].score - a[1].score);
    return sortedData.map((itemWithData) => {
      let item = itemWithData[0];
      const parentIsOneLevel = isOneLevel;
      let _isOneLevel = data[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
      let _isDisabled = data[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;

      if (data[item].children) {
        if (data[item].score >= scoreFilter) {
          return (
            <>
              <TreeNode
                title={
                  <div id={`camp-${data[item].camp_id}`}>
                    <div
                      className={
                        "treeListItem " + styles.topicDetailsTreeListItem
                      }
                    >
                      <span
                        className={
                          "treeListItemTitle " + styles.treeListItemTitle
                        }
                      >
                        <Link
                          href={{
                            pathname: includeReview
                              ? data[item]?.review_link?.replace(
                                  "#statement",
                                  ""
                                )
                              : data[item]?.link?.replace("#statement", ""),
                          }}
                        >
                          <a
                            className={
                              data[item]?.camp_id ==
                                router?.query?.camp?.at(1)?.split("-")?.at(0) ??
                              "1"
                                ? `font-weight-bold ${styles.activeCamp}`
                                : ""
                            }
                          >
                            {includeReview
                              ? data[item]?.review_title
                              : data[item]?.title}
                          </a>
                        </Link>
                      </span>
                      <span
                        className={
                          "treeListItemNumber " + styles.treeListItemNumber
                        }
                      >
                        {/* data[item].topic_score
                            ? data[item].topic_score?.toFixed(2)
                            : */}
                        {is_checked && isUserAuthenticated
                          ? data[item].full_score?.toFixed(2)
                          : data[item].score?.toFixed(2)}
                      </span>
                      <span className={styles.subScriptionIcon}>
                        {isUserAuthenticated &&
                          subScriptionStatus(data[item].subscribed_users)}
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
                }}
              >
                {data[item].camp_id ===
                  +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1) &&
                  _isDisabled == 0 &&
                  parentIsOneLevel == 0 && (
                    <TreeNode
                      key={"custom"}
                      title={
                        <p className={styles.startNew}>
                          <Link
                            href={{
                              pathname: `/camp/create/${
                                replaceSpecialCharacters(
                                  router.query.camp[0],
                                  "-"
                                ) +
                                "/" +
                                replaceSpecialCharacters(
                                  router.query.camp[1],
                                  "-"
                                )
                              }`,
                            }}
                          >
                            <a>{`<Start new supporting camp here>`} </a>
                          </Link>
                        </p>
                      }
                    />
                  )}

                {renderTreeNodes(data[item].children, _isDisabled, _isOneLevel)}
              </TreeNode>
            </>
          );
        } else {
          return null;
        }
      }
      return <TreeNode key={data[item].key} {...data[item]} />;
    });
  };

  return tree?.at(0) ? (
    showTree && (
      <Tree
        showLine={{ showLeafIcon: false }}
        defaultExpandedKeys={[
          +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1) == 1
            ? 2
            : +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
        ]}
        onSelect={onSelect}
        autoExpandParent={true}
        // filterTreeNode={filterTreeNode}
      >
        {tree?.at(0) && renderTreeNodes(tree?.at(0))}
      </Tree>
    )
  ) : (
    <p>No Camp Tree Found</p>
  );
};

export default CampTree;
