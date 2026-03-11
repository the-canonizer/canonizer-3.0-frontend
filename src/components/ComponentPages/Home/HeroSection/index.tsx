import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { RootState } from "src/store";
import styles from "./HeroSection.module.scss";

const HeroSection = () => {
  const router = useRouter();
  const { firstName, isAuthenticated } = useSelector((state: RootState) => ({
    firstName: state?.auth?.loggedInUser?.first_name,
    isAuthenticated: state?.auth?.authenticated,
  }));

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value?.trim();
      if (value) {
        router.push(`/browse?search=${encodeURIComponent(value)}`);
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className={styles.hero} data-testid="hero-section">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <h1>
              <span className={styles.wave}>👋</span> Hey {firstName || "there"}
            </h1>
            <p>Find where people agree — and where they don&apos;t.</p>
          </div>
          <div className={styles.heroSearch}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search topics..."
              onKeyDown={handleSearch}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.heroLanding} data-testid="hero-section">
      <div className={styles.heroLandingInner}>
        <div className={styles.eyebrow}>A new kind of conversation</div>
        <h1 className={styles.headline}>
          The internet argues.
          <br />
          <span className={styles.accentLine}>
            Canonizer finds where everyone agrees.
          </span>
        </h1>
        <p className={styles.subheadline}>
          Pick a question. Say where you stand. See where everyone agrees.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/registration">
            <a className={styles.ctaPrimary}>Join for free</a>
          </Link>
        </div>
        <div className={styles.trustLine}>
          Free to join · No ads · Built for understanding
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
