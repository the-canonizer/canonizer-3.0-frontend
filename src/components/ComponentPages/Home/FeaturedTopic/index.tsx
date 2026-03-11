import { useSelector } from "react-redux";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";

import { RootState } from "src/store";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import styles from "./FeaturedTopic.module.scss";

const FeaturedTopic = () => {
  const { topicData } = useSelector((state: RootState) => ({
    topicData: state?.hotTopic?.topicData,
  }));

  const featured = topicData?.[0];

  if (!featured) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noData}>No featured topic available</div>
      </div>
    );
  }

  const topicLink = `/topic/${featured?.topic_num}-${replaceSpecialCharacters(
    featured?.topic_name || "",
    "-"
  )}/${featured?.camp_num || 1}-${replaceSpecialCharacters(
    featured?.camp_name || "Agreement",
    "-"
  )}`;

  const descriptionText = featured?.description
    ? sanitizeHtml(featured.description, { allowedTags: [] })
    : "";

  // Extract camp names from tree_structure if available
  const camps =
    featured?.tree_structure
      ?.slice(1, 4)
      ?.map((c: any) => c?.camp_name || c?.title) || [];

  const dotClasses = [styles.dot1, styles.dot2, styles.dot3, styles.dot4];

  return (
    <div className={styles.wrapper} data-testid="featured-topic">
      <Link href={topicLink}>
        <a style={{ textDecoration: "none" }}>
          <div className={styles.featuredCard}>
            <div className={styles.badge}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured Topic
            </div>
            <div className={styles.title}>
              {featured?.title || featured?.topic_name || "Hot Topic"}
            </div>
            {descriptionText && (
              <div className={styles.description}>{descriptionText}</div>
            )}
            <div className={styles.stats}>
              <span className={styles.stat}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {featured?.tree_structure?.length || 0} participants
              </span>
              <span className={styles.stat}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {camps.length} positions
              </span>
              {camps.length > 0 && (
                <div className={styles.positions}>
                  {camps.map((name: string, i: number) => (
                    <span key={i} className={styles.miniPosition}>
                      <span
                        className={`${styles.miniDot} ${
                          dotClasses[i] || dotClasses[0]
                        }`}
                      />
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default FeaturedTopic;
