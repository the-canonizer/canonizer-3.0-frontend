import React from "react";
import styles from "./aiAnalysisTab.module.scss";

const mockData = {
  commonGround:
    "All participants agree that social media's current model is causing real harm — particularly around misinformation and mental health. The status quo is not acceptable, and some form of change is needed.",
  bridgeOpportunities: [
    {
      text: '<em>3 people</em> said they\'d support regulation if it focused on <em>transparency requirements</em> rather than mandating specific feed formats.',
    },
    {
      text: '<em>2 people</em> want regulation but worry about <em>government overreach</em> — they\'d support an independent oversight body instead.',
    },
  ],
  keyTensions: [
    {
      label: "Who should act:",
      text: "Government mandates vs. industry self-regulation vs. individual empowerment",
    },
    {
      label: "Speed vs. caution:",
      text: "Immediate legislation vs. careful deliberation to avoid enabling censorship",
    },
    {
      label: "Fix or replace:",
      text: "Reform existing platforms vs. build decentralized alternatives from scratch",
    },
  ],
};

const AIAnalysisTab = () => {
  return (
    <div className={styles.aiAnalysisWrapper}>
      <div className={styles.aiBadge}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
          <path d="M16 14a6 6 0 0 1-12 0" />
          <path d="M12 14v8" />
          <path d="M8 22h8" />
        </svg>
        AI Consensus Analysis
      </div>
      <div className={styles.synthesisTitle}>Where This Community Stands</div>
      <div className={styles.synthesisBody}>
        Based on responses across all positions, here&apos;s what emerges:
      </div>

      <div className={styles.commonGround}>
        <div className={styles.commonGroundLabel}>Common Ground</div>
        <div className={styles.commonGroundText}>{mockData.commonGround}</div>
      </div>

      <div className={styles.bridgeSection}>
        <div className={styles.bridgeLabel}>Bridge Opportunities</div>
        {mockData.bridgeOpportunities.map((item, idx) => (
          <div
            key={idx}
            className={styles.insightCard}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        ))}
      </div>

      <div className={styles.tensionsSection}>
        <div className={styles.tensionLabel}>Key Tensions</div>
        {mockData.keyTensions.map((item, idx) => (
          <div key={idx} className={styles.tensionItem}>
            <div className={styles.tensionDot} />
            <span>
              <strong>{item.label}</strong> {item.text}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.aiFooter}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        AI analysis is advisory — the community&apos;s words remain canonical
      </div>
    </div>
  );
};

export default AIAnalysisTab;
