import { Card } from "antd";

const DisclaimerMsg = () => {
  return process.env.NEXT_PUBLIC_HIDE_DISCLAIMER === "false" ? (
    <div>
      <Card className="bg-[#fff3cd] mb-6 text-center text-[#856404] border-[#ffeeba] font-medium font-inter text-sm">
        This is not the live system. Any data submitted here is for testing
        purposes only and will be lost. Please go to{" "}
        <a
          href="https://canonizer.com/"
          target="_blank"
          rel="noreferrer"
          className="text-canBlue hover:text-canHoverBlue"
        >
          canonizer.com
        </a>
      </Card>
    </div>
  ) : (
    <div></div>
  );
};
export default DisclaimerMsg;
