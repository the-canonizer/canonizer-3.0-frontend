import { Badge, Card, Col, Form, List, Row, Tag } from "antd";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./style.module.scss";

import PostCustomSkelton from "./postCard";
import SubscriptionCustomSkelton from "./subscriptionCard";
import DelegateCardSkeleton from "./delegateCard";
import UserProfileCardSkeleton from "./userProfileSupportCars";
import FeaturedTopicCard from "./featuredTopicCard";
import HotTopicCard from "./hotTopicCard";
import Meta from "antd/lib/card/Meta";

const CustomSkelton = ({
  titleName = "",
  skeltonFor,
  bodyCount,
  stylingClass,
  action = true,
  bordered = true,
  title = true,
  cardStylingClass = "",
  listStyle = "blank",
  circle = false,
  height = 0,
}: any) => {
  return skeltonFor == "card" ? (
    <Card
      className={` ${styles.cardSkeleton} ${styles[cardStylingClass]}`}
      bordered={bordered}
      actions={
        action
          ? [
              <div key={0} className={styles.cardSkeleton_actions}>
                <Skeleton
                  className={styles.cardSkeleton_actions_button}
                  count={1}
                />
              </div>,
            ]
          : []
      }
      title={
        title ? (
          <h3>{titleName}</h3>
        ) : (
          <Skeleton
            height={29}
            className={styles[stylingClass]}
            style={{ margin: "2px 0" }}
            count={1}
          />
        )
      }
    >
      <Skeleton className={styles[stylingClass]} count={bodyCount} />
    </Card>
  ) : skeltonFor == "list" ? (
    <List itemLayout="horizontal" className="activity-list-wrap">
      <List.Item className="activityStyle.activitiesList">
        <List.Item.Meta
          title={<Skeleton style={{ height: "30px" }} />}
          description={<Skeleton style={{ width: "40%", height: "18px" }} />}
        />
      </List.Item>
    </List>
  ) : skeltonFor == "tree" ? (
    <Card title="Consensus tree progression" className="tree-progression-card">
      <div className={styles.svgD3} style={{ marginBottom: "2rem" }}>
        <Skeleton style={{ width: "50%", height: "25px" }} />
      </div>
    </Card>
  ) : skeltonFor == "video" ? (
    <Skeleton height={height} width={"100%"} />
  ) : skeltonFor == "post_card" ? (
    <PostCustomSkelton bodyCount={bodyCount} stylingClass={stylingClass} />
  ) : skeltonFor == "subscription_card" ? (
    <SubscriptionCustomSkelton
      bodyCount={bodyCount}
      stylingClass={stylingClass}
    />
  ) : skeltonFor == "profileCard" ? (
    <UserProfileCardSkeleton
      bodyCount={bodyCount}
      stylingClass={stylingClass}
      key="profileCard_unique"
    />
  ) : skeltonFor == "directSupportCampsCard" ? (
    <Skeleton
      className={styles.directSupportedCampsListSkeleton}
      count={bodyCount}
    />
  ) : skeltonFor == "delegateSupportedCampListCard" ? (
    <DelegateCardSkeleton bodyCount={bodyCount} stylingClass={stylingClass} />
  ) : skeltonFor == "manageSupportCard" ? (
    <Card
      className={styles.manageCardSkeleton}
      actions={[
        <div key={0} className={styles.manageCardSkeleton_actions}>
          <Skeleton
            className={styles.manageCardSkeleton_actions_button}
            count={1}
          />
        </div>,
      ]}
      title=<Skeleton
        height={29}
        className={styles[stylingClass]}
        style={{ margin: "2px 0" }}
        count={1}
      />
    >
      <Skeleton className={styles[stylingClass]} count={bodyCount} />
    </Card>
  ) :  skeltonFor == "topicName" ? (
    <Skeleton
      height={20}
      width={120}
      style={{ margin: "2px 0" }}
      count={1}
    />
  ): skeltonFor == "profileInfoForm" ? (
    <Form layout="vertical">
      <Row gutter={30}>
        <Col md={12}>
          <Skeleton className={styles.profileInfoForm} count={bodyCount} />
        </Col>
        <Col md={12}>
          <Skeleton className={styles.profileInfoForm} count={bodyCount} />
        </Col>
      </Row>
    </Form>
  ) : skeltonFor == "verifyInfoForm" ? (
    <Form className={styles.verifyInfoForm} layout="vertical">
      <Row gutter={30}>
        <Col md={12}>
          <Skeleton className={styles.profileInfoForm} count={bodyCount} />
        </Col>
        <Col md={12}>
          <Skeleton className={styles.profileInfoForm} count={bodyCount} />
        </Col>
      </Row>
    </Form>
  ) : skeltonFor == "table" ? (
    <Form>
      <Col>
        <Skeleton className={styles.header_column} count={1} />
      </Col>
      <Form className={styles.table_form}>
        <Col>
          <Skeleton className={styles.body_column} count={bodyCount} />
        </Col>
      </Form>
    </Form>
  ) : skeltonFor == "profileDetails" ? (
    <div>
      <Row gutter={30}>
        <Col md={12} sm={12} xs={12}>
          <Skeleton className={styles.userProfileLabel} count={bodyCount} />
        </Col>
        <Col md={12} sm={12} xs={12}>
          <Skeleton className={styles.userProfileLabel} count={bodyCount} />
        </Col>
      </Row>
    </div>
  ) : skeltonFor == "comparisonPage" ? (
    <div className="ch-wrapper">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Skeleton style={{ height: 36 }} />
          <Skeleton style={{ height: 320 }} />
        </Col>
        <Col xs={24} md={12}>
          <Skeleton style={{ height: 36 }} />
          <Skeleton style={{ height: 320 }} />
        </Col>
        <Col xs={24} md={24}>
          <Skeleton style={{ height: 36 }} />
          <Skeleton style={{ height: 320 }} />
        </Col>
      </Row>
    </div>
  ) : skeltonFor == "playButtons" ? (
    <div className="audio-player">
      <div className="player-wrapper">
        <div className="player-controller">
          <div className=" flex flex-row gap-2 ">
            <Skeleton style={{ width: "25px", height: "15px" }} />
            <Skeleton style={{ width: "25px", height: "15px" }} />
            <Skeleton style={{ width: "25px", height: "15px" }} />
            <Skeleton style={{ width: "25px", height: "15px" }} />
          </div>
        </div>
        <div className="share-wrapper ">
          <Skeleton style={{ width: "25px", height: "15px" }} />
        </div>
      </div>
      <Skeleton />
    </div>
  ) : skeltonFor == "search" ? (
    <Skeleton
      className={styles.search_skeleton}
      count={bodyCount}
      circle={circle}
    />
  ) : skeltonFor == "videos" ? (
    <>
      <Card
        className="video-parent-card"
        title={<Skeleton width={460} count={1} enableAnimation />}
      >
        <Row gutter={[16, 16]}>
          <>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8} xl={6}>
              <Card
                className="video-inner-card"
                cover={
                  <>
                    <Skeleton style={{ height: "200px" }} />
                  </>
                }
              >
                <Meta title={<Skeleton />} />
              </Card>
            </Col>
          </>
        </Row>
      </Card>
    </>
  ) : skeltonFor == "featuredTopic" ? (
    <FeaturedTopicCard bodyCount={bodyCount} stylingClass={stylingClass} />
  ) : skeltonFor == "hotTopic" ? (
    <HotTopicCard stylingClass={stylingClass} />
  ) : skeltonFor == "browse" ? (
    <Row gutter={[24, 24]}>
      {[...Array(9)].map((_, index) => (
        <Col key={index} xs={24} sm={24} md={8}>
          <Card className="browse-card overflow-hidden">
            <div className="mb-2.5 flex justify-between">
              <Skeleton style={{ width: 300 }} />
            </div>
            <Skeleton style={{ width: 100 }} />
            <Skeleton style={{ width: 800 }} />
            <List className="">
              <List.Item className="w-full flex font-medium p-0">
                <div className="flex justify-between gap-3 w-full items-start flex-wrap">
                  <div className="text-left flex">
                    <Skeleton style={{ width: 130 }} />
                    <Skeleton style={{ width: 40 }} />
                  </div>
                  <Skeleton />
                </div>
              </List.Item>
            </List>
          </Card>
        </Col>
      ))}
    </Row>
  ) : skeltonFor == "historyPage" ? (
    <>
      <div className="cn-wrapper px-5 py-5">
        <div className="badge-wrapper">
          <div className="tooltip-count">
            <p>
              <Skeleton style={{ width: 50, height: 25 }} />
            </p>
          </div>
        </div>
        <div className="mb-[1.25rem] ch-checkbox">
          <Skeleton style={{ width: 50, height: 25 }} />
        </div>

        <Card className="cn-card">
          <div>
            <p className="font-semibold mb-2.5">
              <Skeleton style={{ height: 25, width: "50%" }} />
            </p>
            <p>
              <span>
                <Skeleton style={{ height: 20, width: "50%" }} />
              </span>
            </p>
            <p>
              <span>
                <Skeleton style={{ height: 20, width: "50%" }} />
              </span>
            </p>
            <p>
              <span>
                <Skeleton style={{ height: 20, width: "50%" }} />
              </span>
            </p>
            <p>
              <span>
                <Skeleton style={{ height: 20, width: "50%" }} />
              </span>
            </p>
            <p>
              <span>
                <Skeleton style={{ height: 20, width: "50%" }} />
              </span>
            </p>
          </div>

          {/* <div className="agreement-wrapper">
            <Skeleton style={{ width: "25%", height: 20 }} />
          </div> */}

          <div className="cn-footer-btn">
            <div className="cn-card-btn">
              <div className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none min-w-[200px]">
                <Skeleton style={{ width: 150, height: 25 }} />
              </div>

              <div className="flex items-center justify-center rounded-[10px] gap-3.5 leading-none min-w-[200px]">
                <Skeleton style={{ width: 150, height: 25 }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  ) : skeltonFor == "videos" ? (
    <Card
      className="video-parent-card"
      title={<Skeleton width={460} count={1} enableAnimation />}
    >
      <Row gutter={[16, 16]}>
        <Row>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8} xl={6}>
            <Card
              className="video-inner-card"
              cover={<Skeleton style={{ height: "200px" }} />}
            >
              <Meta title={<Skeleton />} />
            </Card>
          </Col>
        </Row>
      </Row>
    </Card>
  ) : (
    /* eslint-disable */
    (skeltonFor = "cardForUploadFile" ? (
      <Card
        className={styles.card_upload_file_skeleton}
        title=<Skeleton
          height={29}
          className={styles[stylingClass]}
          style={{ margin: "2px 0" }}
          count={1}
        />
      >
        <div className={styles.outer_div_upload_file}>
          <Skeleton
            className={styles.upload_files_skeleton}
            count={bodyCount}
          />
        </div>
      </Card>
    ) : /* eslint-enable */
    null)
  );
};

export default CustomSkelton;
