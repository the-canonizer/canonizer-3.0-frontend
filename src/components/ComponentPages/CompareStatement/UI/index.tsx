import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import {
  Typography,
  Button,
  Row,
  Col,
  Card,
  Divider,
  Breadcrumb,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  HomeOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";

import styles from "./index.module.scss";

import CampInfoBar from "../../TopicDetails/CampInfoBar";
import CustomSkelton from "../../../common/customSkelton";
import { capitalizeFirstLetter, changeSlashToArrow } from "src/utils/generalUtility";
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


  const [compareMode, setCompareMode] = useState(true)
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
      <Breadcrumbs compareMode={compareMode} />

      <div className="ch-wrapper">
        <Button onClick={getBackUrl}
          type="link"
          className="text-2xl text-[#242B37] p-1 mb-14 gap-5 flex items-center max-lg:hidden leading-none"
          icon={<i className="icon-back"></i>}
        >
          {router?.query?.from && capitalizeFirstLetter(router?.query?.from)} History Comparison
        </Button>
        <Row gutter={[60, 60]}>
          <Col xs={24} md={12}>
            <HistoryCard compareMode={compareMode} comparisonData={s1} status={itemsStatus[s1?.id]} />
          </Col>
          <Col xs={24} md={12}>
            <HistoryCard compareMode={compareMode} comparisonData={s2} status={itemsStatus[s2?.id]} />
          </Col>
          <Col xs={24} md={24}>
            <HistoryCard compareMode={compareMode} comparisonData={liveStatement} status={liveStatement?.status} />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CompareStatementUI;



{/* <div className="cn-breadcrumbs">
        <Breadcrumb
          separator={
            <>
              <i className="icon-angle-right"></i>
            </>
          }
        >
          <Breadcrumb.Item href="">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">(Canon) General</Breadcrumb.Item>
          <Breadcrumb.Item href="">
            Topic: Representationalist Books
          </Breadcrumb.Item>
          <Breadcrumb.Item>Topic History</Breadcrumb.Item>
        </Breadcrumb>
      </div> */}


{/* <Row gutter={[60, 60]}>
          <Col xs={24} md={12}>
            <div className="cn-wrapper live-wrapper">
              <div className="badge-wrapper">
                <Badge
                  className="cn-dot-badge"
                  color=""
                  text={
                    <>
                      16 Feb 2024,<span>04:36 PM</span>
                    </>
                  }
                />
              </div>

              <Card className="cn-card">
                <p className="mb-[1.25rem]">
                  Camp Name:<span>Agreement</span>
                </p>
                <p className="font-semibold mb-2.5">Updates</p>
                <p>
                  Category:<span>Test</span>
                </p>
                <p>
                  Edit summary:<span>Minor tweaks</span>
                </p>
                <p>
                  Camp about URL:<a> www.thisisalink.com</a>
                </p>
                <p>
                  Camp about Nickname: <span>Jane</span>
                </p>
                <p>
                  Submitter nickname:<span>Mary Ann</span>
                </p>
                <p>
                  Disable additional sub-camps:<span>No</span>
                </p>
                <p>
                  Single level Camps only:<span>Minor tweaks</span>
                </p>
                <p>
                  Camp archived:<span> Jane Doe</span>
                </p>
                <p>
                  Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
                </p>
                <p>
                  Going live on :<span>17 Feb 2024, 04:36 PM</span>
                </p>
              </Card>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="cn-wrapper pending-wrapper">
              <div className="badge-wrapper">
                <Badge
                  className="cn-dot-badge"
                  color=""
                  text={
                    <>
                      16 Feb 2024,<span>04:36 PM</span>
                    </>
                  }
                />
              </div>

              <Card className="cn-card">
                <p className="mb-[1.25rem]">
                  Camp Name:<span>Agreement</span>
                </p>
                <p className="font-semibold mb-2.5">Updates</p>
                <p>
                  Category:<span>Test</span>
                </p>
                <p>
                  Edit summary:<span>Minor tweaks</span>
                </p>
                <p>
                  Camp about URL:<a> www.thisisalink.com</a>
                </p>
                <p>
                  Camp about Nickname: <span>Jane</span>
                </p>
                <p>
                  Submitter nickname:<span>Mary Ann</span>
                </p>
                <p>
                  Disable additional sub-camps:<span>No</span>
                </p>
                <p>
                  Single level Camps only:<span>Minor tweaks</span>
                </p>
                <p>
                  Camp archived:<span> Jane Doe</span>
                </p>
                <p>
                  Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
                </p>
                <p>
                  Going live on :<span>17 Feb 2024, 04:36 PM</span>
                </p>
              </Card>
            </div>
          </Col>
          <Col xs={24} sm={24}>
            <div className="cn-wrapper objected-wrapper">
              <div className="badge-wrapper">
                <Badge
                  className="cn-dot-badge"
                  color=""
                  text={
                    <>
                      16 Feb 2024,<span>04:36 PM</span>
                    </>
                  }
                />
              </div>

              <Card className="cn-card">
                <p className="mb-[1.25rem]">
                  Camp Name:<span>Agreement</span>
                </p>
                <p className="font-semibold mb-2.5">Updates</p>
                <p>
                  Category:<span>Test</span>
                </p>
                <p>
                  Edit summary:<span>Minor tweaks</span>
                </p>
                <p>
                  Camp about URL:<a> www.thisisalink.com</a>
                </p>
                <p>
                  Camp about Nickname: <span>Jane</span>
                </p>
                <p>
                  Submitter nickname:<span>Mary Ann</span>
                </p>
                <p>
                  Disable additional sub-camps:<span>No</span>
                </p>
                <p>
                  Single level Camps only:<span>Minor tweaks</span>
                </p>
                <p>
                  Camp archived:<span> Jane Doe</span>
                </p>
                <p>
                  Submitted on:<span> 16 Feb 2024, 04:36 PM</span>
                </p>
                <p>
                  Going live on :<span>17 Feb 2024, 04:36 PM</span>
                </p>
              </Card>
            </div>
          </Col>
        </Row> */}