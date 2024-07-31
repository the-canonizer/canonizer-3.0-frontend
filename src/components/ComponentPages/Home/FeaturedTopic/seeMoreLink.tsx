import Link from "next/link";
import PropTypes from "prop-types";

const propTypes = {
  title: PropTypes.string,
  href: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

const SeeMoreLink = ({
  title = "See More",
  href,
}: {
  title?: string;
  href?: any;
}) => {
  return (
    <Link href={href}>
      <a className="!text-canBlue hover:!text-canHoverBlue text-sm font-inter font-medium">
        {title}
      </a>
    </Link>
  );
};

SeeMoreLink.propTypes = propTypes;

export default SeeMoreLink;
