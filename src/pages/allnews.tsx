import React, { useState } from "react";
import { campNewsFeedApi } from "../network/api/addupdateNewsApi";
import Link from "next/link";

export default function allnews({ res }) {
  console.log("result ====> 2 ? ", res.data);

  const [result, setResult] = useState(res.data);
  return (
    <>
      <div style={{ maxWidth: "500px" }}>
        <h1>edit and udadate and add news here</h1>
        <br />
        {result.map((re) => {
          return (
            <div key={re.id}>
              <h3>
                dispaly text : {re.display_text}/ . Link : {re.link} /.
                Available : {re.available_for_child}{" "}
              </h3>
            </div>
          );
        })}
        <Link href="/addnews">
          <a style={{ fontSize: 22 }}>To add News</a>
        </Link>
        <br />
        <Link href="/updatenews">
          <a style={{ fontSize: 22 }}>To edit News</a>
        </Link>
      </div>
    </>
  );
}
export async function getServerSideProps() {
  const res = await campNewsFeedApi();
  console.log("result ====> ? ", res);

  return {
    props: {
      res,
    },
  };
}
