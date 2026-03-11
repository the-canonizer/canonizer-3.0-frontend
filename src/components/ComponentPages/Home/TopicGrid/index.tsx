import { useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

import { RootState } from "src/store";
import {
  getCanonizedTopicsApi,
  getCanonizedNameSpacesApi,
} from "src/network/api/homePageApi";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import styles from "./TopicGrid.module.scss";

const TopicGrid = () => {
  const {
    canonizedTopics,
    asofdate,
    asof,
    algorithm,
    filterByScore,
    filterNameSpaceId,
    nameSpaces,
  } = useSelector((state: RootState) => ({
    canonizedTopics: state.homePage?.canonizedTopicsData,
    asofdate: state.filters?.filterObject?.asofdate,
    asof: state.filters?.filterObject?.asof,
    algorithm: state.filters?.filterObject?.algorithm,
    filterByScore: state.filters?.filterObject?.filterByScore,
    filterNameSpaceId: String(state?.filters?.filterObject?.namespace_id),
    nameSpaces: state.homePage?.nameSpaces,
  }));

  useEffect(() => {
    if (!(nameSpaces?.length > 0)) {
      getCanonizedNameSpacesApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const reqBody = {
      algorithm: algorithm,
      asofdate:
        asof === "default" || asof === "review"
          ? Date.now() / 1000
          : asofdate,
      namespace_id: filterNameSpaceId,
      page_number: 1,
      page_size: 6,
      search: "",
      filter: filterByScore,
      asof: asof,
      user_email: "",
      is_archive: 0,
      sort: false,
    };
    getCanonizedTopicsApi(reqBody, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asofdate, asof, algorithm, filterNameSpaceId, filterByScore]);

  const topics = canonizedTopics?.topics?.slice(0, 6) || [];
  const totalCount = canonizedTopics?.topics?.length || 0;

  // Find the namespace label for a topic
  const getNamespaceLabel = () => {
    if (!nameSpaces?.length) return "";
    const ns = nameSpaces.find(
      (n: any) => String(n.id) === filterNameSpaceId
    );
    return ns?.label || "";
  };

  if (!topics.length) {
    return (
      <div className={styles.skeleton}>Loading topics...</div>
    );
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          Recent Topics
          {totalCount > 0 && (
            <span className={styles.sectionCount}>{totalCount}</span>
          )}
        </span>
        <Link href="/browse">
          <a className={styles.sectionLink}>
            View all
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </Link>
      </div>

      <div className={styles.grid}>
        {topics.map((item: any, index: number) => {
          const topicLink = `/topic/${
            item?.topic_id
          }-${replaceSpecialCharacters(
            item?.topic_name,
            "-"
          )}/1-Agreement`;

          // Calculate a simple score bar
          const score = item?.topic_score || 0;
          const fullScore = item?.topic_full_score || score || 1;
          const greenPct = fullScore > 0 ? Math.round((score / fullScore) * 100) : 50;
          const orangePct = Math.round((100 - greenPct) * 0.6);
          const redPct = 100 - greenPct - orangePct;

          return (
            <Link href={topicLink} key={item?.topic_id || index}>
              <a className={styles.card}>
                <div className={styles.cardCategory}>
                  {getNamespaceLabel() || "General"}
                </div>
                <div className={styles.cardTitle}>{item?.topic_name}</div>
                <div className={styles.cardDesc}>
                  {item?.tree_structure?.[1]?.review_title || ""}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardMeta}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    {item?.tree_structure?.length || 0} participants
                  </span>
                  <div className={styles.cardBar}>
                    <div
                      className={`${styles.barSeg} ${styles.segG}`}
                      style={{ width: `${greenPct}%` }}
                    />
                    <div
                      className={`${styles.barSeg} ${styles.segO}`}
                      style={{ width: `${orangePct}%` }}
                    />
                    <div
                      className={`${styles.barSeg} ${styles.segR}`}
                      style={{ width: `${redPct}%` }}
                    />
                  </div>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TopicGrid;
