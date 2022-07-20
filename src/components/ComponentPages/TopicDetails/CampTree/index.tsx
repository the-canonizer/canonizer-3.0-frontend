import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../topicDetails.module.scss";

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
  const router = useRouter();
  const onSelect = (
    selectedKeys,
    e: { selected; selectedNodes; node; event }
  ) => {
    if (selectedKeys.join() === "custom" || selectedKeys.join() === "") {
      console.log("selected", selectedKeys, e);
    } else {
      setSelectedNodeID(+selectedKeys.join(""));
      scrollToCampStatement();
    }
  };
  useEffect(() => {
    setScoreFilter(filterByScore);
    setIncludeReview(review == "review" ? true : false);
  }, [filterByScore, review]);

  const renderTreeNodes = (data: any) =>
    Object.keys(data).map((item) => {
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
                          // href={data[item]?.link
                          //   ?.replace("#statement", "")
                          //   .replace("//", "/")}
                          href={`${router?.query?.camp[0]}/${router?.query?.camp[1]}`}
                          passHref
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
                    </div>
                  </>
                }
                key={data[item].camp_id}
              >
                {data[item].camp_id ===
                  +router?.query?.camp?.at(1)?.split("-")?.at(0) && (
                  <TreeNode
                    key={"custom"}
                    title={
                      <p className={styles.startNew}>
                        <Link
                          href={`/camp/create/${
                            router.query.camp[0] + "/" + router.query.camp[1]
                          }`}
                        >
                          <a>{`<Start new supporting camp here>`} </a>
                        </Link>
                      </p>
                    }
                  />
                )}
                {renderTreeNodes(data[item].children)}
              </TreeNode>
            </>
          );
        } else {
          return null;
        }
      }
      return <TreeNode key={data[item].key} {...data[item]} />;
    });

  return tree ? (
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
  ) : (
    <p>No Camp Tree Found</p>
  );
};

export default CampTree;
