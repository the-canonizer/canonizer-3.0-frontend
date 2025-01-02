import sanitizeHtml from "sanitize-html";
import PropTypes from "prop-types";
import { convert } from "html-to-text";

import CustomSkelton from "src/components/common/customSkelton";

const propTypes = {
  description: PropTypes.string,
  loading: PropTypes.bool,
  isBrowsing: PropTypes.bool,
  className: PropTypes.string,
  descriptionTextLength: PropTypes.number,
};

export const handleTextOverflow = (text, length = 220) => {
  const str = convert(text?.replace(/<img[^>]*>/gi, ""), {
    wordwrap: 130,
  });

  return str?.length > length ? str?.substring(0, length) + "..." : str;
};

const CardDescription = ({
  description,
  loading = false,
  isBrowsing = false,
  className = "",
  descriptionTextLength = 220,
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
          isBrowsing ? "text-base" : "text-sm "
        } font-inter font-normal overflow-hidden text-canBlack opacity-80 italic`}
      >
        No information available
      </div>
    );
  }

  return (
    <div
      id="browse-description-container"
      className={`${className} ${
        isBrowsing ? "text-base " : "text-sm "
      } font-inter !font-normal overflow-hidden text-canBlack opacity-80 [&_strong]:font-normal [&_*]:font-normal leading-[1.6]`}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(
          handleTextOverflow(description, descriptionTextLength),
          {
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
          }
        ),
      }}
    ></div>
  );
};

CardDescription.propTypes = propTypes;

export default CardDescription;
