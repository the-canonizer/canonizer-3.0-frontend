import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./HeroSection"));
const SocialProof = dynamic(() => import("./SocialProof"));
const HowItWorks = dynamic(() => import("./HowItWorks"));
const CategoryChips = dynamic(() => import("./CategoryChips"));
const FeaturedTopic = dynamic(() => import("./FeaturedTopic"));
const TopicGrid = dynamic(() => import("./TopicGrid"));
const ActiveTopics = dynamic(() => import("./ActiveTopics"));

const HomePageContainer = () => {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <HowItWorks />
        <CategoryChips />
        <FeaturedTopic />
        <TopicGrid />
        <ActiveTopics />
      </div>
    </>
  );
};

export default HomePageContainer;
