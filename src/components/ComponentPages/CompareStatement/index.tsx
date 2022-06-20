import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import HtmlDiff from "htmldiff-js";

import CompareStatementUI from "./UI";

import {
  getCompareStatement,
  getCampStatementHistoryApi,
} from "../../../network/api/campStatementHistory";
import { RootState } from "../../../store";

function CompareStatement() {
  const [isLoading, setIsLoading] = useState(false);
  const [statements, setStatements] = useState([]);

  const router = useRouter();

  const back = () => {
    const q = router.query;
    router.push({
      pathname: `/statement/history/${q.routes[0]}/${q.routes[1]}`,
    });
  };

  const stringToHTML = function (str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return doc.body.innerHTML;
  };

  const getStatement = async (ids) => {
    setIsLoading(true);
    const reqBody = { ids };
    const res = await getCompareStatement(reqBody);

    const statements = res.data,
      s1 = statements[0],
      s2 = statements[1];

    s1.parsed_v = HtmlDiff.execute(s2?.parsed_value, s1?.parsed_value);
    s2.parsed_v = HtmlDiff.execute(s1?.parsed_value, s2?.parsed_value);

    setIsLoading(false);
    if (res && res.status_code === 200) {
      setStatements(statements);
    }
  };

  useEffect(() => {
    const q = router?.query;
    const ids = [q?.s1, q?.s2];
    getStatement(ids);
  }, [router]);

  const { campStatementHistory } = useSelector((state: RootState) => ({
    campStatementHistory: state?.topicDetails?.campStatementHistory,
  }));

  useEffect(() => {
    const campStatementApiCall = async () => {
      try {
        setIsLoading(true);
        const reqBody = {
          topic_num: +router.query.routes[0].split("-")[0],
          camp_num: +router.query.routes[1].split("-")[0],
          as_of: "default",
        };
        await getCampStatementHistoryApi(reqBody);
        setIsLoading(false);
      } catch (error) {}
    };
    campStatementApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CompareStatementUI
      statements={statements}
      isLoading={isLoading}
      campStatementHistory={campStatementHistory}
    />
  );
}

export default CompareStatement;
