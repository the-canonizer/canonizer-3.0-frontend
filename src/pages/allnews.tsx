import React, { useState } from "react";
import FormData from "../components/addnewsformdata/formadd";

import FormDataupdate from "../components/addnewsformdata/formupdate";
import { useRouter } from "next/router";
import Link from "next/link";
import { newsdata } from "../components/addnewsformdata/addnewsdata";
export default function allnews() {
  const [newdata, setnewdata] = useState(newsdata);
  const [id, setid] = useState(null);
  const router = useRouter();
  console.log("data=> ", newdata);
  console.log("select data1=> ", id);

  return (
    <>
      <div style={{ maxWidth: "500px" }}>
        <h1>alll news</h1>
        {newdata.map((news) => {
          return (
            <div
              key={news.id}
              onClick={() =>
                setid({ id: news.id, text: news.text, link: news.link })
              }
            >
              <h4>text : {news.text}</h4>
              <h6>link : {news.link}</h6>
            </div>
          );
        })}
        {!id && (
          <div>
            <h1>Add news </h1>
            <FormDataupdate setnewdata={setnewdata} />
          </div>
        )}
        {id && (
          <div>
            <h1>update news </h1>
            <FormData setnewdata={setnewdata} selecteddata={id} />
          </div>
        )}
      </div>
    </>
  );
}
