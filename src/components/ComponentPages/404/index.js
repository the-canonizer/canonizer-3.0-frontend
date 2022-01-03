import { useRouter } from "next/router";
import React from "react";

const My404 = () => {
  const router = useRouter();
  const goBack = (props) => {
    router.back();
  };
  return (
    <h1>
      404 - Page Not Found.
      <b onClick={goBack}>Click here</b> to go back.
    </h1>
  );
};

export default My404;
