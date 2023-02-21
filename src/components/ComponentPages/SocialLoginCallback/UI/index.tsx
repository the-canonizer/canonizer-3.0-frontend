import { Fragment } from "react";
import { Row, Col, List, Typography, Collapse } from "antd";

import styles from "../../Home/TopicsList/topicsList.module.scss";
import helpStyles from "../../Home/HelpCard/helpCard.module.scss";

import CustomSkelton from "../../../common/customSkelton";

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

function SocialLoginCallback() {
  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar">
        <div className="leftSideBar_Card">
          <div className="btnsWrap">
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass="listSkeleton"
              isButton={false}
            />
          </div>
          <Collapse
            className={`${styles.cardAccordian} topicListFilterCardCollapse`}
            expandIconPosition="right"
            bordered={false}
            defaultActiveKey={["1", "2", "3"]}
          >
            <Panel
              header={
                <span className={styles.title}>
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="listSkeleton"
                    isButton={false}
                  />
                </span>
              }
              key="1"
            >
              <div className={styles.algo_title}>
                <Title level={5} className={styles.algoText}>
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="listSkeleton"
                    isButton={false}
                  />
                </Title>
              </div>
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
              />
              <Paragraph className={styles.algoInfo}>
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              </Paragraph>
              <div className={styles.filter}>
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              </div>
            </Panel>
            <Panel
              header={
                <span className={styles.title}>
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="listSkeleton"
                    isButton={false}
                  />
                </span>
              }
              key="2"
            >
              <CustomSkelton
                skeltonFor="list"
                bodyCount={3}
                stylingClass="listSkeleton"
                isButton={false}
              />

              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
              />
            </Panel>

            <Panel
              header={
                <span className={styles.title}>
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="listSkeleton"
                    isButton={false}
                  />
                </span>
              }
              key="3"
            >
              <div className={styles.scoreCheckbox}>
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              </div>
            </Panel>
          </Collapse>
        </div>
      </aside>
      <div className="pageContentWrap">
        <Row gutter={8}>
          <Col xs={24} sm={24} xl={12}>
            <div className={`${styles.card} topicsList_card`}>
              <List
                className={styles.wrap}
                bordered
                dataSource={["", ""]}
                renderItem={(item: any) => {
                  return (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={5}
                      stylingClass="listSkeleton"
                      isButton={false}
                    />
                  );
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={24} xl={12}>
            <section className={helpStyles.wrap}>
              <div className="help-card-wrap">
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={10}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              </div>
            </section>
          </Col>
          <Col xs={24} sm={24} xl={24}>
            <section className={helpStyles.wrap}>
              <div className="help-card-wrap">
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={5}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              </div>
            </section>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
}

export default SocialLoginCallback;
