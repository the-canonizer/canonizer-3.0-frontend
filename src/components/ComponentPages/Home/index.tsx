import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./HeroSection"));
const CategoryChips = dynamic(() => import("./CategoryChips"));
const FeaturedTopic = dynamic(() => import("./FeaturedTopic"));
const TopicGrid = dynamic(() => import("./TopicGrid"));
const ActiveTopics = dynamic(() => import("./ActiveTopics"));
const HowItWorks = dynamic(() => import("./HowItWorks"));

const HomePageContainer = () => {
  return (
    <>
      <HeroSection />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <CategoryChips />
        <FeaturedTopic />
        <TopicGrid />
        <ActiveTopics />
        <HowItWorks />
      </div>
    </>
  );
};

export default HomePageContainer;
