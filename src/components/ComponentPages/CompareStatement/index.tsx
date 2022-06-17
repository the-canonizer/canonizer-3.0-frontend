import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import HtmlDiffer from "html-differ";

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

  const getStatement = async (ids) => {
    setIsLoading(true);
    const reqBody = { ids };
    const res = await getCompareStatement(reqBody);
    console.log("🚀 ~ file: index.tsx ~ line 31 ~ getStatement ~ res", res.data)
    setIsLoading(false);
    if (res && res.status_code === 200) {
      setStatements(res.data);
    }
  };

  useEffect(() => {
    const q = router?.query;
    const ids = [q?.s1, q?.s2];
    getStatement(ids);
  }, [router]);

  // const htmlDiffer = new HtmlDiffer.HtmlDiffer({
  //   preset: "bem",
  //   ignoreAttributes: [],
  // });
  // const html1 = "<p>Hello</p>",
  //   html2 = "<p>Hello World!</p>";

  // const diff = htmlDiffer.diffHtml(html1, html2),
  //   isEqual = htmlDiffer.isEqual(html1, html2);

  // console.log(
  //   "🚀 ~ file: index.tsx ~ line 16 ~ CompareStatement ~ htmlDiffer",
  //   htmlDiffer,
  //   diff,
  //   isEqual
  // );

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
