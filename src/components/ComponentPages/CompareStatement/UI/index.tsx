import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Row, Col, Tabs } from "antd";
import styles from "./index.module.scss";

import CustomSkelton from "../../../common/customSkelton";
import { capitalizeFirstLetter } from "src/utils/generalUtility";
import Breadcrumbs from "components/ComponentPages/Breadcrumbs/breadcrumbs";
import HistoryCard from "components/ComponentPages/HistoryCard/historyCard";
import moment from "moment";
const validUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

function CompareStatementUI({
  statements,
  isLoading,
  liveStatement,
  itemsStatus,
}: any) {
  const [compareMode, setCompareMode] = useState(true);
  const [currentVersion, setCurrentVersion] = useState(true);
  const router = useRouter();
  const s1 = statements?.at(0) || {},
    s2 = statements?.at(1) || {},
    from = router?.query?.from;

    console.log("s1Status",s1?.status);
    console.log("s2Status",s2?.status);
    
  const breakpoint = 768;

  // Initialize state without using window.innerWidth directly
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  const convertToTime = (unixTime) => {
    return moment(unixTime * 1000).format("hh:mm:ss A");
  };
  
  const convertToDate = (unixTime) => {
    return moment(unixTime * 1000).format("DD MMMM YYYY");
  };

  const getStatusClass = (status: any) => {
    switch (status) {
      case "live":
        return "live-tab";
      case "in_review":
        return "pending-wrapper";
      case "objected":
        return "objected-wrapper";
      case "old":
        return "previous-wrapper";
      default:
        return "";
    }
  };
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  let payload = {
    camp_num: router?.query?.routes[1]?.split("-")[0] ?? "1",
    topic_num: router?.query?.routes[0]?.split("-")[0],
  };

  const getBackUrl = () => {
    const query = router?.query;
    if (query.from === "topic") {
      router?.push({
        pathname: `/topic/history/${router?.query?.routes[0]}/${router?.query?.routes[1]}`,
      });
    } else if (query.from === "statement") {
      router?.push({
        pathname: `/statement/history/${router?.query?.routes[0]}/${router?.query?.routes[1]}`,
      });
    } else {
      router?.push({
        pathname: `/camp/history/${router?.query?.routes[0]}/${router?.query?.routes[1]}`,
      });
    }
  };

  return (
    <>
      <Breadcrumbs compareMode={compareMode} historyOF={router?.query?.from} />

      {isLoading ? (
        <CustomSkelton skeltonFor="comparisonPage" />
      ) : (
        <div className="ch-wrapper">
          <Button
            onClick={getBackUrl}
            type="link"
            className="text-2xl text-canBlack p-1 mb-14 gap-5 flex items-center max-lg:hidden leading-none"
            icon={<i className="icon-back"></i>}
          >
            {router?.query?.from && capitalizeFirstLetter(router?.query?.from)}{" "}
            History Comparison
          </Button>

          {!isMobileView && (
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <HistoryCard
                  compareMode={compareMode}
                  comparisonData={s1}
                  status={itemsStatus[s1?.id]}
                  s1={true}
                />
              </Col>
              <Col xs={24} md={12}>
                <HistoryCard
                  compareMode={compareMode}
                  comparisonData={s2}
                  status={itemsStatus[s2?.id]}
                />
              </Col>
              {liveStatement !== null && (
                <Col xs={24} md={24}>
                  <HistoryCard
                    compareMode={compareMode}
                    comparisonData={liveStatement}
                    status={liveStatement?.status}
                    currentVersion={currentVersion}
                  />
                </Col>
              )}
            </Row>
          )}

          {isMobileView && (
            <Tabs
              defaultActiveKey="1"
              centered
              className={`comparision-mobile-tabs ${getStatusClass(s1?.status)} `}
              
            >
              <Tabs.TabPane
                className="comparison-tab-content"
                tab={
                  <>
                    <p>{convertToDate(s1?.submit_time)}</p>
                    <span>{convertToTime(s1?.submit_time)}</span>
                  </>
                }
                key="1"
              >
                <Col xs={24} md={12}>
                  <HistoryCard
                    compareMode={compareMode}
                    comparisonData={s1}
                    status={itemsStatus[s1?.id]}
                    s1={true}
                    isMobileView={isMobileView}
                  />
                </Col>
              </Tabs.TabPane>

              <Tabs.TabPane
                className="comparison-tab-content"
                tab={
                  <>
                    <p>{convertToDate(s2?.submit_time)}</p>
                    <span>{convertToTime(s2?.submit_time)}</span>
                  </>
                }
                key="2"
              >
                <Col xs={24} md={12}>
                  <HistoryCard
                    compareMode={compareMode}
                    comparisonData={s2}
                    status={itemsStatus[s2?.id]}
                    isMobileView={isMobileView}
                  />
                </Col>
              </Tabs.TabPane>
            </Tabs>
          )}
        </div>
      )}
    </>
  );
}

export default CompareStatementUI;
