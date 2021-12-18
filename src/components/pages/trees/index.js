import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTreesApi } from "../../../network/api/treeApi";

const Trees = () => {
  const [data, setData] = useState();
  const dispatch = useDispatch();
  useEffect(async () => {
    const result = await getTreesApi(dispatch);
    await setData(result);
  }, []);
  return (
    <>
      <h1>Trees Page</h1>
      {data?.data.map((record) => (
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
