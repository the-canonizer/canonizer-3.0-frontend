import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

const JoinCanonizer = ({ className = "" }) => {
  return (
    <Link href="/login" key="join-canoinzer">
      <a
        className={`bg-canBlue hover:bg-canHoverBlue font-medium !text-white disabled:bg-disabled text-sm leading-sm rounded-lg font-inter px-5 py-3 ${className}`}
      >
        <span>Join Canonizer </span>
        <ArrowRightOutlined />
      </a>
    </Link>
  );
};

export default JoinCanonizer;
