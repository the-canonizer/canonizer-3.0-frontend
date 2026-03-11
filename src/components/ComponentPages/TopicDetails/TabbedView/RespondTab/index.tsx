import React, { useState } from "react";
import styles from "./respondTab.module.scss";

interface RespondTabProps {
  campStatement: any;
  campRecord: any;
}

const RespondTab = ({ campStatement, campRecord }: RespondTabProps) => {
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const handleSelect = (type: string) => {
    setActiveDrawer(activeDrawer === type ? null : type);
  };

  // Mock engagement counts (to be replaced with real data later)
  const engagementCounts = {
    support: 8,
    almost: 6,
    disagree: 4,
  };

  return (
    <div className={styles.respondTabWrapper}>
      <div className={styles.respondHeader}>What do you think?</div>
      <div className={styles.respondSubheader}>
        Your response helps build a picture of where people agree and disagree.
      </div>

      <div className={styles.respondOptions}>
        <button
          className={`${styles.respondBtn} ${styles.respondAgree} ${
            activeDrawer === "agree" ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleSelect("agree")}
        >
          <span className={styles.respondCount}>{engagementCounts.support}</span>
          <span className={styles.thumbIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          </span>
          <span className={styles.respondBtnLabel}>I Support This</span>
          <span className={styles.respondBtnDesc}>This reflects my view</span>
        </button>

        <button
          className={`${styles.respondBtn} ${styles.respondPartial} ${
            activeDrawer === "partial" ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleSelect("partial")}
        >
          <span className={styles.respondCount}>{engagementCounts.almost}</span>
          <span className={styles.thumbIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </span>
          <span className={styles.respondBtnLabel}>Almost There</span>
          <span className={styles.respondBtnDesc}>I&apos;d support this if...</span>
        </button>

        <button
          className={`${styles.respondBtn} ${styles.respondDisagree} ${
            activeDrawer === "disagree" ? styles.active : ""
          }`}
          type="button"
          onClick={() => handleSelect("disagree")}
        >
          <span className={styles.respondCount}>{engagementCounts.disagree}</span>
          <span className={styles.thumbIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
              <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
            </svg>
          </span>
          <span className={styles.respondBtnLabel}>I Disagree</span>
          <span className={styles.respondBtnDesc}>I see it differently</span>
        </button>
      </div>

      {/* Drawers */}
      {activeDrawer === "agree" && (
        <div className={`${styles.responseDrawer} ${styles.drawerAgree}`}>
          <div className={styles.drawerTitle}>You support this position!</div>
          <div className={styles.drawerDesc}>
            Want to add a note about why? (Optional)
          </div>
          <textarea
            className={styles.drawerTextarea}
            placeholder="e.g., I've seen firsthand how algorithmic feeds affect..."
          />
          <div className={styles.drawerActions}>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
              onClick={() => setActiveDrawer(null)}
            >
              Skip
            </button>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnSubmit}`}
              onClick={() => setActiveDrawer(null)}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {activeDrawer === "partial" && (
        <div className={`${styles.responseDrawer} ${styles.drawerPartial}`}>
          <div className={styles.drawerTitle}>
            What would it take for you to fully support this?
          </div>
          <div className={styles.drawerDesc}>
            Your input helps AI identify where common ground can be built.
          </div>
          <textarea
            className={styles.drawerTextarea}
            placeholder="e.g., I agree algorithms are a problem, but..."
          />
          <div className={styles.drawerActions}>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
              onClick={() => setActiveDrawer(null)}
            >
              Cancel
            </button>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnSubmitOrange}`}
              onClick={() => setActiveDrawer(null)}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {activeDrawer === "disagree" && (
        <div className={`${styles.responseDrawer} ${styles.drawerDisagree}`}>
          <div className={styles.drawerTitle}>Share your alternative view</div>
          <div className={styles.drawerDesc}>
            What do you believe instead? Your response may become a new position
            for others to consider.
          </div>
          <textarea
            className={styles.drawerTextarea}
            rows={4}
            placeholder="e.g., Government regulation of algorithms sets a dangerous precedent..."
          />
          <div className={styles.drawerActions}>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnCancel}`}
              onClick={() => setActiveDrawer(null)}
            >
              Cancel
            </button>
            <button
              className={`${styles.drawerBtn} ${styles.drawerBtnSubmitRed}`}
              onClick={() => setActiveDrawer(null)}
            >
              Submit Counter-Position
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RespondTab;
