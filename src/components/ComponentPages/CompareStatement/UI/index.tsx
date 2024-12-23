import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Row, Col, Tabs } from "antd";
import moment from "moment";

import CustomSkelton from "../../../common/customSkelton";
import { capitalizeFirstLetter } from "src/utils/generalUtility";
import HistoryCard from "components/ComponentPages/HistoryCard/historyCard";
import CommonBreadcrumbs from "components/ComponentPages/Breadcrumbs/commonBreadcrumbs";

function CompareStatementUI({
  statements,
  isLoading,
  liveStatement,
  itemsStatus,
}: any) {
  const [compareMode] = useState(true);
  const [currentVersion] = useState(true);
  const [tabId, setTabId] = useState("1");
  const router = useRouter();

  const s1 = statements?.at(0) || {},
    s2 = statements?.at(1) || {};

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
        return "pending-tab";
      case "objected":
        return "objected-tab";
      case "old":
        return "previous-tab";
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
      <CommonBreadcrumbs
        compareMode={compareMode}
        historyOF={router?.asPath?.split("/")?.at(1)}
      />

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
            {router?.asPath?.split("/")?.at(1) &&
              capitalizeFirstLetter(router?.asPath?.split("/")?.at(1))}{" "}
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
            <Fragment>
              <Tabs
                defaultActiveKey="1"
                centered
                className={`comparision-mobile-tabs ${
                  tabId && tabId === "1"
                    ? getStatusClass(itemsStatus[s1?.id])
                    : getStatusClass(itemsStatus[s2?.id])
                }`}
                onChange={(id) => {
                  setTabId(id);
                }}
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
              {liveStatement !== null && (
                <div className="mt-10">
                  <HistoryCard
                    compareMode={compareMode}
                    comparisonData={liveStatement}
                    status={liveStatement?.status}
                    currentVersion={currentVersion}
                  />
                </div>
              )}
            </Fragment>
          )}
        </div>
      )}
    </>
  );
}

export default CompareStatementUI;
