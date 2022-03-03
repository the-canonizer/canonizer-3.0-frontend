import { useEffect, useState } from "react";
import { getTreesApi } from "src/network/api/treeApi";
import { Tree, Card } from "antd";
import { CarryOutOutlined, FormOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Styles from './campTree.module.scss';

const { TreeNode } = Tree;
const CampTree = (props) => {
  const [treesList, setTreesList] = useState();
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
    console.log("selected", selectedKeys, info);
  };

  const renderTreeNodes = (data: any) =>
    Object.keys(data).map((item) => {
      if (data[item].children) {
        return (
          <TreeNode
            // switcherIcon={<PlusSquareOutlined />}
            title={
              <div className={"treeListItem " + Styles.treeListItem}>
                <span className={"treeListItemTitle " + Styles.treeListItemTitle}> {data[item].title}</span>
                <span className={"treeListItemNumber " + Styles.treeListItemNumber}> {data[item].score}</span>
              </div>
            }
            key={data[item].camp_id}
            // link={data[item].link}
            // review_link={data[item].review_link}
            // review_title={data[item].review_title}
            // score={data[item].score}
            // topic_id={data[item].topic_id}
            // dataRef={data[item]}
          >
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
