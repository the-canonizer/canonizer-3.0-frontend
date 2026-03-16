import styles from "./SocialProof.module.scss";

const STATS = [
  { value: "2,400+", label: "Topics Created" },
  { value: "15,000+", label: "Participants" },
  { value: "50+", label: "Fields of Study" },
];

const SocialProof = () => {
  return (
    <div className={styles.bar}>
      {STATS.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SocialProof;
