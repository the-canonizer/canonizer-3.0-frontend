import FormDataupdate from "../components/addnewsformdata/formupdate";
import React, { useState } from "react";
export default function Home() {
  const [update, setUpdate] = useState([
    { id: 1, text: "wahaj", link: "https://www.wahaj.com", available: true },
    { id: 2, text: "waha", link: "https://www.waha.com", available: false },
    { id: 3, text: "wah", link: "https://www.wah.com", available: true },
    { id: 4, text: "wa", link: "https://www.wa.com", available: false },
  ]);

  return (
    <>
      <div style={{ maxWidth: "500px" }}>
        <h1>Update news</h1>
        <FormDataupdate update={update} />
      </div>
    </>
  );
}
