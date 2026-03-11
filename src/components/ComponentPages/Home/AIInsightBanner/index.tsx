import Link from "next/link";
import { ThunderboltOutlined } from "@ant-design/icons";

import styles from "./AIInsightBanner.module.scss";

const AIInsightBanner = () => {
  return (
    <div className={styles.wrapper} data-testid="ai-insight-banner">
      <div className={styles.iconWrap}>
        <ThunderboltOutlined />
      </div>
      <div className={styles.content}>
        <span className={styles.label}>AI Insight</span>
        <p className={styles.insightText}>
          Trending now: Discussions around artificial consciousness are gaining
          momentum. Multiple camps are forming around the question of whether
          large language models exhibit emergent understanding or sophisticated
          pattern matching.
        </p>
        <Link href="/browse">
          <a className={styles.learnMore}>
            Learn More &rarr;
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AIInsightBanner;
