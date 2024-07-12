import { useState } from "react";
import { useRouter } from "next/router";
import { Typography, Button, Row, Col } from "antd";
import styles from "./index.module.scss";

import CustomSkelton from "../../../common/customSkelton";
import { capitalizeFirstLetter } from "src/utils/generalUtility";
import Breadcrumbs from "components/ComponentPages/Breadcrumbs/breadcrumbs";
import HistoryCard from "components/ComponentPages/HistoryCard/historyCard";

const { Title, Text, Paragraph } = Typography;

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
  const router = useRouter();
  const s1 = statements?.at(0) || {},
    s2 = statements?.at(1) || {},
    from = router?.query?.from;

  let payload = {
    camp_num: router?.query?.routes[1]?.split("-")[0] ?? "1",
    topic_num: router?.query?.routes[0]?.split("-")[0],
  };

  const getBackUrl = () => {
    const query = router?.query;
    if (query.from === "topic") {
      router?.push({
        pathname: `/topic/history/${router?.query?.routes[0]}}`,
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
      <Breadcrumbs compareMode={compareMode} historyOF={router && router?.query?.from} />
      {isLoading ? (
        <CustomSkelton skeltonFor="comparisonPage" />
      ) : (
        <div className="ch-wrapper">
          <Button
            onClick={getBackUrl}
            type="link"
            className="text-2xl text-[#242B37] p-1 mb-14 gap-5 flex items-center max-lg:hidden leading-none"
            icon={<i className="icon-back"></i>}
          >
            {router?.query?.from && capitalizeFirstLetter(router?.query?.from)}{" "}
            History Comparison
          </Button>
          <Row gutter={[60, 60]}>
            <Col xs={24} md={12}>
              <HistoryCard
                compareMode={compareMode}
                comparisonData={s1}
                status={itemsStatus[s1?.id]}
              />
            </Col>
            <Col xs={24} md={12}>
              <HistoryCard
                compareMode={compareMode}
                comparisonData={s2}
                status={itemsStatus[s2?.id]}
              />
            </Col>
            <Col xs={24} md={24}>
              <HistoryCard
                compareMode={compareMode}
                comparisonData={liveStatement}
                status={liveStatement?.status}
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default CompareStatementUI;
