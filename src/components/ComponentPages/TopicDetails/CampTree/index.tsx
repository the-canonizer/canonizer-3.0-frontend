import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Styles from "../topicDetails.module.scss";

const { TreeNode } = Tree;

const CampTree = ({ scrollToCampStatement, getSelectedNode }) => {
  const { tree, filterByScore } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree,
    filterByScore: state.filters?.filterObject?.filterByScore,
  }));
  const [selectedNodeID, setSelectedNodeID] = useState(1);
  const [scoreFilter, setScoreFilter] = useState(filterByScore);

  const onSelect = (
    selectedKeys,
    e: { selected; selectedNodes; node; event }
  ) => {
    if (selectedKeys.join() === "custom" || selectedKeys.join() === "") {
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
                    <div className={"treeListItem " + Styles.treeListItem}>
                      <span
                        className={
                          "treeListItemTitle " + Styles.treeListItemTitle
                        }
                      >
                        {" "}
                        {data[item].title}
                      </span>
                      <span
                        className={
                          "treeListItemNumber " + Styles.treeListItemNumber
                        }
                      >
                        {" "}
                        {data[item].score?.toFixed(2)}
                      </span>
                    </div>
                  </>
                }
                key={data[item].camp_id}
              >
                {selectedNodeID === data[item].camp_id && (
                  <TreeNode
                    key={"custom"}
                    title={
                      <p
                        onClick={() => {
                          "supportCamp";
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

  return (
    <Tree
      showLine={{ showLeafIcon: false }}
      defaultExpandedKeys={["1"]}
      onSelect={onSelect}
      autoExpandParent={true}
      // filterTreeNode={filterTreeNode}
    >
      {tree && renderTreeNodes(tree)}
    </Tree>
  );
};

export default CampTree;
