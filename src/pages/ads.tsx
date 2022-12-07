import * as React from "react";
import GoogleAd from "../components/googleAds";
// const GoogleAd = dynamic(() => import("../components/googleAds"), {
//   ssr: false,
// });
interface IADSProps {}

const ADS: React.FunctionComponent<IADSProps> = () => {
  return (
    <>
      <h1>ads</h1>
      <GoogleAd />
      <h1>ads</h1>
    </>
  );
};

ADS.displayName = "ADS";

export default ADS;
