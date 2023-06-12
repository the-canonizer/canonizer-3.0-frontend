import {
  Avatar,
  Card,
  Col,
  Form,
  Input,
  Row,
  Switch,
  Table,
  Typography,
} from "antd";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import FormItem from "../formElements";

import styles from "./style.module.scss";

import PostCustomSkelton from "./postCard";
import SubscriptionCustomSkelton from "./subscriptionCard";
import DelegateCardSkeleton from "./delegateCard";
import UserProfileCardSkeleton from "./userProfileSupportCars";
const { Title } = Typography;

const CustomSkelton = ({
  titleName = "",
  skeltonFor,
  bodyCount,
  stylingClass,
  isButton,
  action = true,
  bordered = true,
  title = true,
  cardStylingClass = "",
  listStyle = "blank",

  circle = false,

  height = 0,
}) => {
  return skeltonFor == "card" ? (
    <Card
      className={` ${styles.cardSkeleton} ${styles[cardStylingClass]}`}
      bordered={bordered}
      actions={
        action
          ? [
              <div className={styles.cardSkeleton_actions}>
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
        <div className={styles.manageCardSkeleton_actions}>
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
  ) : (
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
    ) : null)
  );
};

export default CustomSkelton;
