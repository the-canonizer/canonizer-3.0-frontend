import { useSelector } from "react-redux";
import Link from "next/link";

import { RootState } from "src/store";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import styles from "./ActiveTopics.module.scss";

const ActiveTopics = () => {
  const canonizedTopics = useSelector(
    (state: RootState) => state.homePage?.canonizedTopicsData
  );

  // Use top topics sorted by score as "most active"
  const topics = [...(canonizedTopics?.topics || [])]
    .sort(
      (a: any, b: any) =>
        (b?.topic_score || 0) - (a?.topic_score || 0)
    )
    .slice(0, 4);

  if (!topics.length) {
    return null;
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          Most Active This Week
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          </svg>
        </span>
      </div>

      <div className={styles.list}>
        {topics.map((item: any, index: number) => {
          const topicLink = `/topic/${
            item?.topic_id
          }-${replaceSpecialCharacters(
            item?.topic_name,
            "-"
          )}/1-Agreement`;

          const score = Math.round(item?.topic_score || 0);
          const camps = item?.tree_structure?.length || 0;

          return (
            <Link href={topicLink} key={item?.topic_id || index}>
              <a className={styles.item}>
                <span className={styles.rank}>{index + 1}</span>
                <div className={styles.content}>
                  <div className={styles.title}>{item?.topic_name}</div>
                  <div className={styles.detail}>
                    {camps} positions
                  </div>
                </div>
                <div className={styles.engagement}>
                  <span className={`${styles.pill} ${styles.pillSupport}`}>
                    👍 {score}
                  </span>
                </div>
                <span className={styles.arrow}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveTopics;
