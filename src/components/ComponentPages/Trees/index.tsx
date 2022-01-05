import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTreesApi } from "../../../network/api/treeApi";
import * as GeneralUtility from "../../../utils/generalUtility";
const Trees = ({ treesData }) => {
  const [data, setData] = useState(treesData);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   async function fetchData() {
  //     let result;
  //     try {
  //       result = await getTreesApi();
  //     } catch (error) {
  //       GeneralUtility.handleError(error, dispatch);
  //     }
  //     await setData(result);
  //   }
  //   fetchData();
  // }, []);
  return (
    <>
      <h1>Trees Page</h1>
      {data &&
        data?.map((record) => (
          <div key={record.id} style={{ backgroundColor: record.color }}>
            <h1>Name: {record.name}</h1>
            <h4>ID: {record.id}</h4>
            <h4></h4>
          </div>
        ))}
    </>
  );
};

export default Trees;
