import React, { useEffect, useState, useRef } from "react";
import styles from "./aiAnalysisTab.module.scss";

interface CampInfo {
  name: string;
  score: number;
  fullScore: number;
}

interface AnalysisData {
  commonGround: string;
  bridgeOpportunities: { text: string }[];
  keyTensions: { label: string; text: string }[];
}

interface AIAnalysisTabProps {
  topicName: string;
  statement: string;
  tree: any;
}

const flattenCamps = (data: any, result: CampInfo[] = []): CampInfo[] => {
  if (!data) return result;
  Object.keys(data).forEach((key) => {
    const camp = data[key];
    if (camp) {
      result.push({
        name: camp.camp_name || camp.review_title || camp.title || "",
        score: camp.score || 0,
        fullScore: camp.full_score || 0,
      });
      if (camp.children) {
        flattenCamps(camp.children, result);
      }
    }
  });
  return result;
};

const AIAnalysisTab = ({ topicName, statement, tree }: AIAnalysisTabProps) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!topicName || !tree) return;

    const cacheKey = topicName;
    if (fetchedRef.current === cacheKey) return;
    fetchedRef.current = cacheKey;

    const camps = flattenCamps(tree);
    if (camps.length === 0) return;

    setLoading(true);
    setError(null);

    fetch("/api/ai-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicName, statement, camps }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAnalysis(data);
      })
      .catch((err) => {
        setError(err.message);
        fetchedRef.current = null;
      })
      .finally(() => setLoading(false));
  }, [topicName, statement, tree]);

  if (loading) {
    return (
      <div className={styles.aiAnalysisWrapper}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <div className={styles.loadingText}>
            Analyzing community positions...
          </div>
          <div className={styles.loadingSub}>
            AI is reading all camps and finding common ground
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.aiAnalysisWrapper}>
        <div className={styles.errorState}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          <div>Unable to generate AI analysis</div>
          <div className={styles.errorDetail}>{error}</div>
          <button
            className={styles.retryBtn}
            onClick={() => {
              fetchedRef.current = null;
              setError(null);
              setLoading(true);
              const camps = flattenCamps(tree);
              fetch("/api/ai-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicName, statement, camps }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.error) throw new Error(data.error);
                  setAnalysis(data);
                  fetchedRef.current = topicName;
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.aiAnalysisWrapper}>
        <div className={styles.emptyState}>
          Click the AI Analysis tab to generate insights for this topic.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.aiAnalysisWrapper}>
      <div className={styles.aiBadge}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
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
        <div className={styles.commonGroundText}>{analysis.commonGround}</div>
      </div>

      <div className={styles.bridgeSection}>
        <div className={styles.bridgeLabel}>Bridge Opportunities</div>
        {analysis.bridgeOpportunities.map((item, idx) => (
          <div
            key={idx}
            className={styles.insightCard}
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        ))}
      </div>

      <div className={styles.tensionsSection}>
        <div className={styles.tensionLabel}>Key Tensions</div>
        {analysis.keyTensions.map((item, idx) => (
          <div key={idx} className={styles.tensionItem}>
            <div className={styles.tensionDot} />
            <span>
              <strong>{item.label}</strong> {item.text}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.aiFooter}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
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
