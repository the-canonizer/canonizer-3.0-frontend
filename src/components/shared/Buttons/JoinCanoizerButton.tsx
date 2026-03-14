import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const JoinCanonizer = ({ className = "" }) => {
  return (
    <Link href="/registration" key="join-canoinzer" id="join-canonizer-link" className={`bg-canBlue hover:bg-canHoverBlue font-medium !text-white disabled:bg-disabled text-sm leading-sm rounded-lg font-inter px-5 py-3 whitespace-nowrap flex items-center ${className}`}>
        <span id="join-canonizer-text">Join Canonizer </span>
        <ArrowRightOutlined id="join-canonizer-icon" />
    </Link>
  );
};

export default JoinCanonizer;
