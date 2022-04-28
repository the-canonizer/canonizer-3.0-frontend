import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import styles from "../topicDetails.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

const { TreeNode } = Tree;

const CampTree = ({ scrollToCampStatement, getSelectedNode }) => {
  const { tree, filterByScore } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree,
    filterByScore: state.filters?.filterObject?.filterByScore,
  }));
  const [selectedNodeID, setSelectedNodeID] = useState(1);
  const [scoreFilter, setScoreFilter] = useState(filterByScore);
  const router = useRouter();
  const onSelect = (
    selectedKeys,
    e: { selected; selectedNodes; node; event }
  ) => {
    if (selectedKeys.join() === "custom" || selectedKeys.join() === "") {
      console.log("selected", selectedKeys, e);
    } else {
      setSelectedNodeID(+selectedKeys.join(""));
      getSelectedNode(+selectedKeys.join());
      scrollToCampStatement();
    }
  };

  useEffect(() => {
    setScoreFilter(filterByScore);
  }, [filterByScore]);

  const renderTreeNodes = (data: any) =>
    Object.keys(data).map((item) => {
      if (data[item].children) {
        if (data[item].score > scoreFilter) {
          return (
            <>
              <TreeNode
                title={
                  <>
                    <div className={"treeListItem " + styles.treeListItem}>
                      <span
                        className={
                          "treeListItemTitle " + styles.treeListItemTitle
                        }
                      >
                        <Link
                          href={`${router.query.camp.at(0)}/${
                            data[item]?.camp_id == 1
                              ? "1-Agreement"
                              : data[item]?.camp_id +
                                "-" +
                                data[item]?.title?.split(" ").join("-")
                          }`}
                        >
                          <a>{data[item].title}</a>
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
                      <p
                        className={styles.startNew}
                        onClick={() => {
                          // console.log("supportCamp");
                        }}
                      >{`<Start new supporting camp here>`}</p>
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
