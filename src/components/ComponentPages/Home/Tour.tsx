import { useEffect } from "react";
import JoyRide, { CallBackProps } from "react-joyride";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "src/store";
import { setIsNewUser } from "src/store/slices/authSlice";

const TOUR_STEPS = [
  {
    target: ".header-search-bar",
    content: "Search via keyword in Canonizer. Lorem ipsum dolor sit amet.",
    disableBeacon: true,
  },
  {
    target: ".create-topic-header-link",
    content: "Create a topic of your preference from here.",
  },
];

const Tour = () => {
  const dispatch = useDispatch();

  const { isShowTour } = useSelector((state: RootState) => ({
    isShowTour: state?.auth?.isNewUser,
  }));

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { index } = data;

    console.log("index---", index);
    if (index === TOUR_STEPS?.length - 1) {
      console.log("inside if index---", index);

      dispatch(setIsNewUser(false));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setIsNewUser(false));
    };
  }, []);

  console.log("isShowTour----", isShowTour);

  return isShowTour ? (
    <JoyRide
      steps={TOUR_STEPS}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      // stepIndex={1}
      // step={1}
      callback={handleJoyrideCallback}
      styles={{
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "white",
          fontSize: "14px",
          fontWeight: "bold",
          color: "black",
        },
        buttonBack: {
          marginRight: 10,
        },
      }}
    />
  ) : null;
};

export default Tour;
