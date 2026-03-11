import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { RootState } from "src/store";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import styles from "./HowItWorks.module.scss";

const STEPS = [
  {
    num: 1,
    title: "Explore a Topic",
    desc: "Browse topics that matter to you, from politics to science to philosophy.",
  },
  {
    num: 2,
    title: "Read the Positions",
    desc: "Each topic has positions — different viewpoints people hold, with their reasoning.",
  },
  {
    num: 3,
    title: "Share Your View",
    desc: "Support a position, suggest changes, or write your own. Every voice counts.",
  },
  {
    num: 4,
    title: "AI Finds Common Ground",
    desc: "AI analyzes all responses to show where people agree — and where the gaps are.",
  },
];

const HowItWorks = () => {
  const [openStep, setOpenStep] = useState<number | null>(null);
  const router = useRouter();

  const { isAuthenticated, topicData, canonizedTopics } = useSelector(
    (state: RootState) => ({
      isAuthenticated: state?.auth?.authenticated,
      topicData: (state as any)?.hotTopic?.topicData,
      canonizedTopics: state.homePage?.canonizedTopicsData,
    })
  );

  // Build hot topic URL for CTAs
  const featured = topicData?.[0];
  const hotTopicUrl = featured
    ? `/topic/${featured.topic_num}-${replaceSpecialCharacters(
        featured.topic_name || "",
        "-"
      )}/${featured.camp_num || 1}-${replaceSpecialCharacters(
        featured.camp_name || "Agreement",
        "-"
      )}`
    : "/browse";

  // TODO: Pull real topic chips from Redux canonizedTopics when available
  const topicChips = (() => {
    const topics = canonizedTopics?.topics?.slice(0, 3) || [];
    if (topics.length > 0) {
      return topics.map((t: any) => ({
        name: t.topic_name,
        url: `/topic/${t.topic_id}-${replaceSpecialCharacters(
          t.topic_name,
          "-"
        )}/1-Agreement`,
      }));
    }
    return [
      { name: "Social Media Reform", url: "/browse" },
      { name: "2028 Elections", url: "/browse" },
      { name: "AI Regulation", url: "/browse" },
    ];
  })();

  const handleToggle = (num: number) => {
    setOpenStep(openStep === num ? null : num);
  };

  const navigateToHotTopic = (withRespond?: boolean) => {
    router.push(withRespond ? `${hotTopicUrl}?respond=true` : hotTopicUrl);
  };

  const renderExpandedContent = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return (
          <div className={styles.expandedContent}>
            <div className={styles.expandedLabel}>Popular right now</div>
            <div className={styles.topicChips}>
              {topicChips.map((chip: any) => (
                <button
                  key={chip.name}
                  className={styles.topicChip}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(chip.url);
                  }}
                >
                  {chip.name}
                </button>
              ))}
            </div>
            <Link href="/browse">
              <a
                className={styles.expandedCta}
                onClick={(e) => e.stopPropagation()}
              >
                Browse all topics &rarr;
              </a>
            </Link>
          </div>
        );

      case 2:
        return (
          <div className={styles.expandedContent}>
            <div className={styles.sampleCard}>
              <div className={styles.sampleName}>
                Regulate Algorithmic Amplification
              </div>
              <div className={styles.sampleDesc}>
                Mandate opt-in algorithms and chronological feeds as default.
              </div>
              <div className={styles.sampleBar}>
                <div
                  className={`${styles.sampleBarSeg} ${styles.segG}`}
                  style={{ width: "55%" }}
                />
                <div
                  className={`${styles.sampleBarSeg} ${styles.segO}`}
                  style={{ width: "25%" }}
                />
                <div
                  className={`${styles.sampleBarSeg} ${styles.segR}`}
                  style={{ width: "20%" }}
                />
              </div>
            </div>
            <button
              className={styles.expandedCta}
              onClick={(e) => {
                e.stopPropagation();
                navigateToHotTopic();
              }}
            >
              See all positions &rarr;
            </button>
          </div>
        );

      case 3:
        return (
          <div className={styles.expandedContent}>
            <div className={styles.expandedLabel}>How would you respond?</div>
            <div className={styles.miniRespond}>
              <button
                className={`${styles.miniBtn} ${styles.miniBtnGreen}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToHotTopic(true);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                </svg>
                Support
              </button>
              <button
                className={`${styles.miniBtn} ${styles.miniBtnOrange}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToHotTopic(true);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                </svg>
                Almost There
              </button>
              <button
                className={`${styles.miniBtn} ${styles.miniBtnRed}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToHotTopic(true);
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
                </svg>
                Disagree
              </button>
            </div>
            <div className={styles.expandedMuted}>
              Your response shapes the consensus
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.expandedContent}>
            <div className={styles.aiSynthesis}>
              <div className={styles.aiBadge}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="12"
                  height="12"
                >
                  <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                </svg>
                AI Synthesis
              </div>
              <div className={styles.aiText}>
                Most participants agree that platform accountability is needed.
                The key divide is between regulatory vs. industry-led
                approaches.
              </div>
              <div className={styles.commonGround}>
                <div className={styles.commonGroundTitle}>Common Ground</div>
                <div className={styles.commonGroundText}>
                  Transparency in how content is ranked is widely supported
                  across all positions.
                </div>
              </div>
            </div>
            <button
              className={styles.expandedCta}
              onClick={(e) => {
                e.stopPropagation();
                navigateToHotTopic();
              }}
            >
              See live analysis &rarr;
            </button>
            <div className={styles.expandedMutedItalic}>
              Powered by Claude AI
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="how-it-works" className={styles.wrapper}>
      <div className={styles.title}>How Canonizer Works</div>
      <div className={styles.steps}>
        {STEPS.map((step) => {
          const isOpen = openStep === step.num;
          return (
            <div
              key={step.num}
              className={`${styles.step} ${isOpen ? styles.stepOpen : ""}`}
              onClick={() => handleToggle(step.num)}
            >
              <div className={styles.stepHeader}>
                <div
                  className={`${styles.stepNum} ${
                    isOpen ? styles.stepNumOpen : ""
                  }`}
                >
                  {isOpen ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      width="16"
                      height="16"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    step.num
                  )}
                </div>
                <div className={styles.stepTextGroup}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDesc}>{step.desc}</div>
                </div>
                <div
                  className={`${styles.stepChevron} ${
                    isOpen ? styles.stepChevronOpen : ""
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="16"
                    height="16"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div
                className={styles.stepBody}
                style={{
                  maxHeight: isOpen ? "500px" : "0",
                }}
              >
                {renderExpandedContent(step.num)}
              </div>
            </div>
          );
        })}
      </div>
      {!isAuthenticated && (
        <div className={styles.ctaRow}>
          <Link href="/registration">
            <a className={styles.ctaBtn}>Get Started &mdash; It&apos;s Free</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;
