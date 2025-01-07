import React, { useState, useEffect, useMemo } from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setSteps } from "src/store/slices/tourSlice";
import { detailPageSteps } from "src/constants/tourGuideSteps";

interface TourGuideProps {
  steps: Step[];
  cookieKey?: string;
}

const TourGuide: React.FC<TourGuideProps> = ({ steps, cookieKey }) => {
  const [cookies, setCookie] = useCookies([cookieKey]);
  const [runTour, setRunTour] = useState(false);
  const [outsideClick, setOutsideClick] = useState(false);
  const router = useRouter();
  const allSteps = useSelector((state: RootState) => state.tour.allSteps);
  const dispatch = useDispatch();

  console.log("all steps:", allSteps);

  // Memoize steps to avoid triggering useEffect unnecessarily
  const memoizedSteps = useMemo(() => steps, [steps]);

  useEffect(() => {
    // Dispatch steps only if they have changed
    if (JSON.stringify(allSteps) !== JSON.stringify(memoizedSteps)) {
      dispatch(setSteps(memoizedSteps));
    }
  }, [dispatch, memoizedSteps, allSteps]);

  useEffect(() => {
    if (!cookies[cookieKey]) {
      setRunTour(true);
    }
  }, [cookies, cookieKey]);

  const handleTourComplete = () => {
    setCookie(cookieKey, "true", { path: "/", maxAge: 31536000 }); // 1 year
    setRunTour(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const joyrideContainer = document.querySelector(".react-joyride__tooltip");
    if (joyrideContainer && !joyrideContainer.contains(event.target as Node)) {
      setOutsideClick(true);
      setCookie(cookieKey, "true", { path: "/", maxAge: 31536000 });
      setRunTour(false);
    }
  };

  useEffect(() => {
    if (runTour) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [runTour]);

  return (
    <Joyride
      steps={router?.asPath == "/" ? allSteps : detailPageSteps}
      run={runTour}
      continuous
      scrollToFirstStep
      showSkipButton
      callback={(data: CallBackProps) => {
        console.log("Joyride callback data:", data?.index);
        const { status } = data;
        if (data?.index === 15 && router?.asPath == "/") {
          dispatch(setSteps(detailPageSteps));
          router.push("/topic/88-Theories-of-Consciousness/1-Agreement");
        } else if (["finished", "skipped"].includes(status)) {
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
