import { Card, Col, Form, Row } from "antd";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import FormItem from "../formElements";

import styles from "./style.module.scss";

import PostCustomSkelton from "./postCard";
import SubscriptionCustomSkelton from "./subscriptionCard";
import DelegateCardSkeleton from "./delegateCard";
import UserProfileCardSkeleton from "./userProfileSupportCars";
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
    <Skeleton
      className={`${styles[stylingClass]} ${styles[listStyle]}`}
      count={bodyCount}
      circle={circle}
    />
  ) : skeltonFor == "tree" ? (
    <ul className={styles.treeSkeleton}>
      <li>
        <Skeleton />
        <ul>
          <li>
            <Skeleton />
            <ul>
              <li>
                <Skeleton />
                <ul>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                  <li>
                    <Skeleton />
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <Skeleton />
          </li>
        </ul>
      </li>
      <li>
        <Skeleton />
        <ul>
          <li>
            <Skeleton />
          </li>
          <li>
            <Skeleton />
          </li>
          <li>
            <Skeleton />
          </li>
        </ul>
      </li>
    </ul>
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
  ) : skeltonFor == "profileInfoForm" ? (
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
  ) : skeltonFor == "playButtons" ? (
    <>
      <div className="slider-skeleton">
        <Skeleton className="inr" count={bodyCount} width={20} height={25} />
      </div>
      <Skeleton className="skeleton-slider2" />
    </>
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
