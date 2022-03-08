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
const CampTree = (props) => {
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

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys);
    setSelectedNodeID(+selectedKeys.join(""));
    debugger;
  };

  const treeData = [
    {
      title: " <Start new supporting camp here>",
      key: "0-0",

      children: [],
    },
  ];

  const renderTreeNodes = (data: any) =>
    Object.keys(data).map((item) => {
      if (data[item].children) {
        return (
          <TreeNode
            // switcherIcon={<PlusSquareOutlined />}
            title={
              <>
                <div className={"treeListItem " + Styles.treeListItem}>
                  <span
                    className={"treeListItemTitle " + Styles.treeListItemTitle}
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
                  {/* {selectedNodeID === data[item].camp_id && <h1>Hello</h1>} */}
                </div>
                {selectedNodeID === data[item].camp_id && (
                  <Tree
                    defaultExpandedKeys={["0-0-0", "0-0-1"]}
                    defaultSelectedKeys={["0-0-0", "0-0-1"]}
                    defaultCheckedKeys={["0-0-0", "0-0-1"]}
                    treeData={treeData}
                    showIcon={false}
                  />
                )}
              </>
            }
            key={data[item].camp_id}
            // link={data[item].link}
            // review_link={data[item].review_link}
            // review_title={data[item].review_title}
            // score={data[item].score}
            // topic_id={data[item].topic_id}
            // dataRef={data[item]}
          >
            {/* <TreeNode icon={(props) => null} title={<h1>{`${{data[item].camp_id}}<Hello>`}</h1>} /> */}
            {renderTreeNodes(data[item].children)}
          </TreeNode>
        );
      }
      return <TreeNode key={data[item].key} {...data[item]} />;
    });

  return (
    <Tree
      showLine={true}
      defaultExpandedKeys={["0-0-0", "0-0-1"]}
      onSelect={onSelect}
      // defaultExpandAll={true}
      autoExpandParent={true}
      //   treeData={treeData}
    >
      {tree && renderTreeNodes(tree)}
    </Tree>
  );
};

export default CampTree;
