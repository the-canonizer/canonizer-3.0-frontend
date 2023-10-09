import { Card, Typography, Row, Col, Form } from "antd";
import Skeleton from "react-loading-skeleton";

import styles from "./style.module.scss";

const { Title } = Typography;

const DelegateCardSkeleton = ({ bodyCount, stylingClass }: any) => {
  const cardArray = [];
  if (bodyCount == null || bodyCount == undefined || bodyCount == "") {
    bodyCount = 1;
  }
  for (let i = 0; i < bodyCount; i++) {
    cardArray.push(
      <Card
        key={"skeleton_card_" + i}
        className={`${styles.cardBox_tags} ${styles.cardSkeleton} ${styles.postCard}`}
        type="inner"
        size="default"
        title={
          <Title level={5} className={styles.card_heading_title}>
            <Skeleton
              height={30}
              className={styles[stylingClass]}
              style={{ margin: "0 0" }}
              count={1}
            />
          </Title>
        }
        extra={
          <Title level={5} className={styles.card_heading_title}>
            <Skeleton
              height={30}
              className={styles[stylingClass]}
              style={{ margin: "0 0" }}
              count={1}
            />
          </Title>
        }
        style={{ width: 760, marginBottom: 16 }}
      >
        <Form layout="vertical">
          <Row gutter={30}>
            <Col md={12}>
              <Skeleton className={styles.delegateSupportedCapms} count={2} />
            </Col>
            <Col span={12}>
              <div className={styles.line_height1}>
                <Skeleton className={styles.delegateSupportedCapms} count={2} />
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
  return <div>{cardArray}</div>;
};

export default DelegateCardSkeleton;
