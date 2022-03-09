import React, { useEffect, useState } from "react";
import { getTreesApi } from "src/network/api/campDetailApi";
import { Tree, Card } from "antd";
import {
  CarryOutOutlined,
  FormOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Styles from "../campTree.module.scss";

const { TreeNode } = Tree;
const CampTree = ({ scrollToCampStatement }) => {
  const [treesList, setTreesList] = useState();
  const [selectedNodeID, setSelectedNodeID] = useState(null);
  const { tree } = useSelector((state: RootState) => ({
    tree: state?.trees?.tree,
  }));
  // useEffect(() => {
  //   async function getTreesApiCallFunc() {
  //     const reqBody = {
  //       topic_num: 88,
  //       asofdate: 1644323333,
  //       algorithm: "mind_experts",
  //       update_all: 0,
  //     };
  //     const response = await getTreesApi(reqBody);

  //     await setTreesList(response);
  //   }
  //   getTreesApiCallFunc();
  // }, []);

  const onSelect = (selectedKeys) => {
    console.log("selected", selectedKeys);
    setSelectedNodeID(+selectedKeys.join(""));
    scrollToCampStatement();
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
                <TreeNode title="<Start new supporting camp here>" />
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
      defaultExpandedKeys={["0-0-0", "0-0-1"]}
      onSelect={onSelect}
      autoExpandParent={true}
    >
      {tree && renderTreeNodes(tree)}
    </Tree>
  );
};

export default CampTree;
