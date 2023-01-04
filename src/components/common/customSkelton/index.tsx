import { Avatar, Card, Switch, Row, Col } from "antd";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import styles from "./style.module.scss";

const { Meta } = Card;

const CustomSkelton = ({ skeltonFor, bodyCount, stylingClass, isButton }) => {
  return skeltonFor == "card" ? (
    <Card
      className={styles.cardSkeleton}
      actions={[
        <div className={styles.cardSkeleton_actions}>
          <Skeleton className={styles.cardSkeleton_actions_button} count={1} />
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
  ) : skeltonFor == "list" ? (
    <Skeleton className={styles.listSkeleton} count={bodyCount} />
  ) : skeltonFor == "HistoryCards" ? (
    <>
      <Card
        className={styles.cardSkeleton}
        actions={[
          <div className={styles.cardSkeleton_actions}>
            <Skeleton
              className={styles.cardSkeleton_actions_button}
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
      <Card
        className={styles.cardSkeleton}
        actions={[
          <div className={styles.cardSkeleton_actions}>
            <Skeleton
              className={styles.cardSkeleton_actions_button}
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
      <Card
        className={styles.cardSkeleton}
        actions={[
          <div className={styles.cardSkeleton_actions}>
            <Skeleton
              className={styles.cardSkeleton_actions_button}
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
    </>
  ) : skeltonFor == "CompareCards" ? (
    <>
      <Row className="mb-4" gutter={50}>
        <Col md={12}>
          <Card
            className={styles.cardSkeleton}
            // bordered={false}
            title=<Skeleton
              height={29}
              className={styles[stylingClass]}
              style={{ margin: "2px 0" }}
              count={1}
            />
          >
            <Skeleton className={styles[stylingClass]} count={bodyCount} />
          </Card>
        </Col>
        <Col md={12}>
          <Card
            className={styles.cardSkeleton}
            title=<Skeleton
              height={29}
              className={styles[stylingClass]}
              style={{ margin: "2px 0" }}
              count={1}
            />
          >
            <Skeleton className={styles[stylingClass]} count={bodyCount} />
          </Card>
        </Col>
      </Row>
      <Card
        className={`${styles.cardSkeleton} ${styles.fullSkeleton}`}
        bordered={false}
        title=<Skeleton
          height={29}
          className={styles[stylingClass]}
          style={{ margin: "2px 0" }}
          count={1}
        />
      >
        <Skeleton className={styles.listSkeleton} count={6} />
      </Card>
    </>
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
  ) : null;
};

export default CustomSkelton;
