import Link from "next/link";

const SeeMoreLInk = ({ title = "See More", href = "#" }) => {
  return (
    <Link href={href}>
      <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-inter font-medium">
        {title}
      </a>
    </Link>
  );
};

export default SeeMoreLInk;
