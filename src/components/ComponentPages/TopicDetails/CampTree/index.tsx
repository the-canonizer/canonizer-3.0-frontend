import React, { useState } from "react";
import { Tree } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Styles from "../campTree.module.scss";

const { TreeNode } = Tree;
const CampTree = ({ scrollToCampStatement, getSelectedNode }) => {
  const [selectedNodeID, setSelectedNodeID] = useState(null);
  const { tree } = useSelector((state: RootState) => ({
    tree: state?.topicDetails?.tree,
  }));

  const onSelect = (
    selectedKeys,
    e: { selected; selectedNodes; node; event }
  ) => {
    console.log("selected", selectedKeys);
    if (selectedKeys.join() === "custom" || selectedKeys.join() === "") {
      console.log(".////////");
    } else {
      setSelectedNodeID(+selectedKeys.join(""));
      getSelectedNode(+selectedKeys.join());
      scrollToCampStatement();
    }
  };

  const renderTreeNodes = (data: any) =>
    Object.keys(data).map((item) => {
      if (data[item].children) {
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
                      {data[item].score}
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
      }
      return <TreeNode key={data[item].key} {...data[item]} />;
    });

  return (
    <Tree
      showLine={{ showLeafIcon: false }}
      defaultExpandedKeys={["1"]}
      onSelect={onSelect}
      autoExpandParent={true}
    >
      {tree && renderTreeNodes(tree)}
    </Tree>
  );
};

export default CampTree;
