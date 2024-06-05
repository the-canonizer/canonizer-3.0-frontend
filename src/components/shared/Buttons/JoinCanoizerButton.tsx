import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const JoinCanonizer = ({ className = "" }) => {
  return (
    <Link href="/login" key="join-canoinzer">
      <a
        className={`bg-blue hover:bg-hblue hover:text-white font-medium text-white disabled:bg-disabled font-base leading-22 rounded-10 font-inter pr-4 pl-4 pt-2 pb-2 ${className}`}
      >
        <span>Join Canonizer </span>
        <ArrowRightOutlined />
      </a>
    </Link>
  );
};

export default JoinCanonizer;
