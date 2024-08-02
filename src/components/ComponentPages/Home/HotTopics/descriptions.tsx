import sanitizeHtml from "sanitize-html";
import PropTypes from "prop-types";

import CustomSkelton from "src/components/common/customSkelton";

const propTypes = {
  description: PropTypes.string,
  loading: PropTypes.bool,
  isBrowsing: PropTypes.bool,
};

const CardDescription = ({
  description,
  loading = false,
  isBrowsing = false,
}) => {
  if (loading) {
    return (
      <CustomSkelton
        skeltonFor="list"
        bodyCount={1}
        stylingClass="listSkeleton"
        isButton={false}
      />
    );
  }

  if (!description) {
    return (
      <div
        className={`${
          isBrowsing ? "text-base" : "text-sm"
        } font-inter font-normal overflow-hidden text-canBlack opacity-80 italic`}
      >
        No description available
      </div>
    );
  }

  return (
    <div
      className={`${
        isBrowsing ? "text-base line-clamp-2" : "text-sm line-clamp-4 h-20"
      } font-inter !font-normal overflow-hidden text-canBlack opacity-80 [&_strong]:font-normal [&_*]:font-normal`}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(description, {
          allowedAttributes: {
            "*": [
              "class",
              "id",
              "href",
              "align",
              "alt",
              "center",
              "bgcolor",
              "src",
              "title",
              "style",
              "rel",
              "target",
            ],
          },
        }),
      }}
    ></div>
  );
};

CardDescription.propTypes = propTypes;

export default CardDescription;
