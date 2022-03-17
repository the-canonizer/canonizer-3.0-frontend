import FormDataupdate from "../components/addnewsformdata/formupdate";

import { editNewsFeedApi } from "../network/api/addupdateNewsApi";
import React, { useState } from "react";
export default function Home({ res }) {
  console.log("edit data 1=> ", res.data);
  const [update, setUpdate] = useState(res.data);

  return (
    <>
      <div style={{ maxWidth: "500px" }}>
        <h1>Update news</h1>
        <FormDataupdate update={update} />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await editNewsFeedApi();
  console.log("result edit  ====> ? ", res);

  return {
    props: {
      res,
    },
  };
}
