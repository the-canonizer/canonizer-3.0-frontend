import Link from "next/link";
import PropTypes from "prop-types";

const propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
};

const SeeMoreLInk = ({ title = "See More", href = "#" }) => {
  return (
    <Link href={href}>
      <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-inter font-medium">
        {title}
      </a>
    </Link>
  );
};

SeeMoreLInk.propTypes = propTypes;

export default SeeMoreLInk;
