import React, { useState, useEffect, useMemo } from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { useCookies } from "react-cookie";

interface TourGuideProps {
  steps: Step[]; // Steps specific to the component
  cookieKey?: string; // Cookie key to track whether the tour has been viewed
}

const TourGuide: React.FC<TourGuideProps> = ({ steps, cookieKey = "layoutTour" }) => {
  const [cookies, setCookie] = useCookies([cookieKey]);
  const [runTour, setRunTour] = useState(false);
  const[allSteps, setAllSteps] = useState<Step[]>([]);
console.log("steps", allSteps);

useEffect(()=>{
  setAllSteps(steps);
},[steps])

  useEffect(() => {
    if (!cookies[cookieKey]) {
      setRunTour(true);
    }
  }, [cookies, cookieKey]);

  const handleTourComplete = () => {
    setCookie(cookieKey, "true", { path: "/", maxAge: 31536000 }); // 1 year
    setRunTour(false);
  };

  return (
    <Joyride
      steps={allSteps}
      run={runTour}
      continuous
      scrollToFirstStep
      showSkipButton
      callback={(data: CallBackProps) => {
        const { status } = data;
        if (["finished", "skipped"].includes(status)) {
          handleTourComplete();
        }
      }}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
};

export default TourGuide;
