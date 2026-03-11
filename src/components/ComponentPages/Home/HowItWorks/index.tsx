import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { RootState } from "src/store";
import { showLoginModal } from "src/store/slices/uiSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import styles from "./HowItWorks.module.scss";

const HowItWorks = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isAuthenticated, topicData } = useSelector((state: RootState) => ({
    isAuthenticated: state?.auth?.authenticated,
    topicData: (state as any)?.hotTopic?.topicData,
  }));

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

  const scrollToTopicFeed = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("topic-feed");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="how-it-works" className={styles.wrapper}>
      <div className={styles.sectionLabel}>How it works</div>

      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
            </svg>
          </div>
          <div className={styles.stepTitle}>Find a topic you care about</div>
          <div className={styles.stepDesc}>
            Browse real questions people are debating — from politics to science to everyday life.
          </div>
          <a href="#topic-feed" className={styles.stepLink} onClick={scrollToTopicFeed}>
            Browse topics &rarr;
          </a>
        </div>

        <div className={styles.stepArrow}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <polyline points="9 11 12 14 22 4" />
            </svg>
          </div>
          <div className={styles.stepTitle}>Say where you stand</div>
          <div className={styles.stepDesc}>
            Support a position, push back, or write your own. No algorithm decides who sees it.
          </div>
          <button
            className={styles.stepLink}
            onClick={() => router.push(hotTopicUrl)}
          >
            See the positions &rarr;
          </button>
        </div>

        <div className={styles.stepArrow}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </div>

        <div className={styles.step}>
          <div className={styles.stepIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="12" r="7" />
              <circle cx="15" cy="12" r="7" />
            </svg>
          </div>
          <div className={styles.stepTitle}>See where everyone agrees</div>
          <div className={styles.stepDesc}>
            AI maps the common ground across all responses — not just who&apos;s loudest.
          </div>
          <button
            className={styles.stepLink}
            onClick={() => router.push(`${hotTopicUrl}?tab=ai-analysis`)}
          >
            See it live &rarr;
          </button>
        </div>
      </div>

      {!isAuthenticated && (
        <div className={styles.ctaRow}>
          <Link href="/registration">
            <a className={styles.ctaBtn}>
              Join the conversation — it&apos;s free
            </a>
          </Link>
          <div className={styles.ctaSub}>
            Already have an account?{" "}
            <button
              className={styles.signInLink}
              onClick={() => dispatch(showLoginModal())}
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorks;
