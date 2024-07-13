import sanitizeHtml from "sanitize-html";

import CustomSkelton from "src/components/common/customSkelton";

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
        } font-inter font-normal overflow-hidden text-canBlack opacity-80 line-clamp-4`}
      >
        No description available
      </div>
    );
  }

  return (
    <div
      className={`${
        isBrowsing ? "text-base line-clamp-2" : "text-sm line-clamp-4"
      } font-inter font-normal overflow-hidden text-canBlack opacity-80 `}
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

export default CardDescription;
