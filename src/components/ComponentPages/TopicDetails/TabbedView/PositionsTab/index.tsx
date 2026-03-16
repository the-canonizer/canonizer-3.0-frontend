import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import styles from "./positionsTab.module.scss";

interface PositionsTabProps {
  tree: any;
}

interface CampData {
  title: string;
  review_title?: string;
  score: number;
  camp_id: number;
  children?: Record<string, CampData>;
}

const getMockProportions = (campId: number) => {
  const seed = (campId * 37) % 100;
  const support = 40 + (seed % 35);
  const almost = Math.min(20 + ((seed * 3) % 20), 100 - support);
  const disagree = 100 - support - almost;
  return { support, almost, disagree };
};

const flattenCamps = (
  data: Record<string, CampData>,
  result: CampData[] = []
): CampData[] => {
  if (!data) return result;

  Object.keys(data).forEach((key) => {
    const camp = data[key];
    if (camp && camp.title) {
      result.push(camp);
      if (camp.children) {
        flattenCamps(camp.children, result);
      }
    }
  });

  return result;
};

const PositionsTab = ({ tree }: PositionsTabProps) => {
  const router = useRouter();
  const topicNum = router?.query?.camp?.[0]?.split("-")?.[0];

  let camps: CampData[] = [];
  if (tree) {
    camps = flattenCamps(tree);
    camps.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  if (camps.length === 0) {
    return (
      <div className={styles.positionsTabWrapper}>
        <p className={styles.emptyState}>
          No camp positions available for this topic.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.positionsTabWrapper}>
      {camps.map((camp, index) => {
        const proportions = getMockProportions(camp.camp_id);
        const campLink = `/topic/${topicNum}-${replaceSpecialCharacters(
          camp.review_title || camp.title,
          "-"
        )}/${camp.camp_id}-${replaceSpecialCharacters(
          camp.title,
          "-"
        )}`;

        return (
          <div key={camp.camp_id} className={styles.positionItem}>
            <div className={styles.positionTop}>
              <span className={styles.positionName}>
                <span className={styles.rank}>{index + 1}</span>
                {camp.review_title || camp.title}
              </span>
              <div className={styles.positionStats}>
                <span className={styles.statAgree}>
                  {proportions.support}% support
                </span>
                <span className={styles.statPartial}>
                  {proportions.almost}% almost
                </span>
                <span className={styles.statDisagree}>
                  {proportions.disagree}% disagree
                </span>
              </div>
            </div>
            <div className={styles.barTrack}>
              <div
                className={`${styles.barSegment} ${styles.segAgree}`}
                style={{ width: `${proportions.support}%` }}
              />
              <div
                className={`${styles.barSegment} ${styles.segPartial}`}
                style={{ width: `${proportions.almost}%` }}
              />
              <div
                className={`${styles.barSegment} ${styles.segDisagree}`}
                style={{ width: `${proportions.disagree}%` }}
              />
            </div>
            <div className={styles.positionDesc}>
              Score: {camp.score?.toFixed(2) || "0.00"}
            </div>
            <Link href={campLink}>
              <a className={styles.viewLink} onClick={(e) => e.stopPropagation()}>
                View full statement
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PositionsTab;
