import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "src/store";
import styles from "./HeroSection.module.scss";

const HeroSection = () => {
  const router = useRouter();
  const firstName = useSelector(
    (state: RootState) => state?.auth?.loggedInUser?.first_name
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = (e.target as HTMLInputElement).value?.trim();
      if (value) {
        router.push(`/browse?search=${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <div className={styles.hero} data-testid="hero-section">
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <h1>
            {firstName ? (
              <>
                <span className={styles.wave}>👋</span> Hey {firstName}
              </>
            ) : (
              "Where People Think Together"
            )}
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
};

export default HeroSection;
