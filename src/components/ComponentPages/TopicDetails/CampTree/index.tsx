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
  const { tree, filterByScore, review } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree,
    filterByScore: state.filters?.filterObject?.filterByScore,
    review: state?.filters?.filterObject?.asof,
  }));
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
      console.log("selected", selectedKeys, e);
    } else {
      dispatch(setCurrentCamp(e?.selectedNodes[0]?.data));
      setSelectedNodeID(+selectedKeys.join(""));
      scrollToCampStatement();
    }
  };
  const { isUserAuthenticated, userID } = useAuthentication();

  const showSelectedCamp = (data, select_camp) => {
    let a = Object?.keys(data).map((item) => {
      if (data[item].children) {
        if (data[item].score >= scoreFilter) {
          if (data[item]?.camp_id == select_camp) {
            setShowTree(true);

            return;
          }
          showSelectedCamp(data[item].children, select_camp);
        } else {
          return null;
        }
      }
      if (data[item]?.camp_id == select_camp) {
        setShowTree(true);
        return;
      }
    });
  };

  useEffect(() => {
    setScoreFilter(filterByScore);
    setIncludeReview(review == "review" ? true : false);
    tree &&
      showSelectedCamp(
        tree,
        +router?.query?.camp?.at(1)?.split("-")?.at(0) == 1
          ? 2
          : +router?.query?.camp?.at(1)?.split("-")?.at(0)
      );
  }, [filterByScore, review]);

  useEffect(() => {
    let isDisabled = 0,
      isOneLevel = 0;
    if (tree != null) {
      Object.keys(tree).map((item) => {
        const parentIsOneLevel = isOneLevel;

        isOneLevel = tree[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
        isDisabled = tree[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;

        if (
          tree[item].camp_id === +router?.query?.camp?.at(1)?.split("-")?.at(0)
        ) {
          dispatch(
            setCurrentCamp({ ...tree[item], parentIsOneLevel, isDisabled })
          );
        }
      });
    }
    console.log("treeee => ", tree);
    tree &&
      showSelectedCamp(
        tree,
        +router?.query?.camp?.at(1)?.split("-")?.at(0) == 1
          ? 2
          : +router?.query?.camp?.at(1)?.split("-")?.at(0)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);

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
    return Object.keys(data).map((item) => {
      const parentIsOneLevel = isOneLevel;
      isOneLevel = data[item].is_one_level == 1 || isOneLevel == 1 ? 1 : 0;
      isDisabled = data[item].is_disabled == 1 || isDisabled == 1 ? 1 : 0;
      console.log(
        "check_one_level =====>   ",
        data[item].camp_id,
        isOneLevel,
        isDisabled
      );

      if (data[item].children) {
        if (data[item].score >= scoreFilter) {
          return (
            <>
              <TreeNode
                title={
                  <>
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
                              router?.query?.camp?.at(1)?.split("-")?.at(0)
                                ? "font-weight-bold text-primary"
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
                        {data[item].score?.toFixed(2)}
                      </span>
                      <span className={styles.subScriptionIcon}>
                        {isUserAuthenticated &&
                          subScriptionStatus(data[item].subscribed_users)}
                      </span>
                    </div>
                  </>
                }
                key={data[item].camp_id}
                data={{ ...data[item], parentIsOneLevel, isDisabled }}
              >
                {data[item].camp_id ===
                  +router?.query?.camp?.at(1)?.split("-")?.at(0) &&
                  isDisabled == 0 &&
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

                {renderTreeNodes(data[item].children, isDisabled, isOneLevel)}
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

  return tree ? (
    showTree && (
      <Tree
        showLine={{ showLeafIcon: false }}
        defaultExpandedKeys={[
          +router?.query?.camp?.at(1)?.split("-")?.at(0) == 1
            ? 2
            : +router?.query?.camp?.at(1)?.split("-")?.at(0),
        ]}
        onSelect={onSelect}
        autoExpandParent={true}
        // filterTreeNode={filterTreeNode}
      >
        {tree && renderTreeNodes(tree)}
      </Tree>
    )
  ) : (
    <p>No Camp Tree Found</p>
  );
};

export default CampTree;
