import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";

import TopBar from "./UI/TopBar";

import ForumUI from "./UI/ForumListUI";

const ForumList = ({ testParamsList = {} }) => {
  const [paramsList, setParamsList] = useState(testParamsList);

  const router = useRouter();

  useEffect(() => {
    const queries = router.query;
    setParamsList(queries);
  }, [router.query]);

  const onSearch = (...rest) => {
    console.log("onSearch rest", rest);
  };

  const onChange = (page, size) => {
    console.log("onChange", page, size);
  };

  return (
    <Fragment>
      <TopBar paramsList={paramsList} />
      <ForumUI onSearch={onSearch} onChange={onChange} />
    </Fragment>
  );
};

export default ForumList;
