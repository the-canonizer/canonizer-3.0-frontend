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
  const [liveStatement, setLiveStatement] = useState({});

  const router = useRouter();

  const getStatement = async (ids) => {
    setIsLoading(true);
    const reqBody = {
      ids,
      topic_num: +router.query.routes[0].split("-")[0],
      camp_num: +router.query.routes[1].split("-")[0],
    };
    const res = await getCompareStatement(reqBody);

    const statements = res.data?.comparison,
      s1 = statements[0],
      s2 = statements[1],
      statementLive = res.data?.liveStatement;

    statementLive.revision_date = res.data?.latestRevision;

    s1.parsed_v = HtmlDiff.execute(s2?.parsed_value, s1?.parsed_value);
    s2.parsed_v = HtmlDiff.execute(s1?.parsed_value, s2?.parsed_value);

    setIsLoading(false);
    if (res && res.status_code === 200) {
      setStatements(statements);
      setLiveStatement(statementLive);
    }
  };

  useEffect(() => {
    const q = router?.query;
    const ids = [q?.s1, q?.s2];
    getStatement(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      liveStatement={liveStatement}
    />
  );
}

export default CompareStatement;
