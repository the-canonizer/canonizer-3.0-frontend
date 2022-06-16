import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import HtmlDiffer from "html-differ";

import CompareStatementUI from "./UI";

import { getCampStatementHistoryApi } from "../../../network/api/campStatementHistory";
import { RootState } from "../../../store";

function CompareStatement() {
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  const router = useRouter();
  const htmlDiffer = new HtmlDiffer.HtmlDiffer({
    preset: "bem",
    ignoreAttributes: [],
  });
  const html1 = "<p>Hello</p>",
    html2 = "<p>Hello World!</p>";

  const diff = htmlDiffer.diffHtml(html1, html2),
    isEqual = htmlDiffer.isEqual(html1, html2);

  console.log(
    "🚀 ~ file: index.tsx ~ line 16 ~ CompareStatement ~ htmlDiffer",
    htmlDiffer,
    diff,
    isEqual
  );

  const { campStatementHistory } = useSelector((state: RootState) => ({
    campStatementHistory: state?.topicDetails?.campStatementHistory,
  }));

  const [campHistory, setCampHistory] = useState(campStatementHistory);

  useEffect(() => {
    setCampHistory(campStatementHistory);
  }, [campStatementHistory]);

  useEffect(() => {
    const campStatementApiCall = async () => {
      try {
        setLoadingIndicator(true);
        const reqBody = {
          topic_num: +router.query.routes[0].split("-")[0],
          camp_num: +router.query.routes[1].split("-")[0],
          as_of: "default",
        };
        await getCampStatementHistoryApi(reqBody);
        setLoadingIndicator(false);
      } catch (error) {
        //console.log(error)
      }
    };
    campStatementApiCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CompareStatementUI
      campStatementHistory={campStatementHistory}
      loadingIndicator={loadingIndicator}
    />
  );
}

export default CompareStatement;
