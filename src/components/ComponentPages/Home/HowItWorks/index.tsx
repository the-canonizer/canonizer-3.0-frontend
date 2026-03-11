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
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>How Canonizer Works</div>
      <div className={styles.steps}>
        {STEPS.map((step) => (
          <div key={step.num} className={styles.step}>
            <div className={styles.stepNum}>{step.num}</div>
            <div className={styles.stepTitle}>{step.title}</div>
            <div className={styles.stepDesc}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
