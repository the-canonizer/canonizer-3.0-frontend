import sanitizeHtml from "sanitize-html";

import CustomSkelton from "src/components/common/customSkelton";

const CardDescription = ({ description, loading = false }) => {
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
      <div className="text-14 font-inter font-normal mb-3 text-black opacity-80 leading-26 overflow-hidden line-clamp-4">
        No description available
      </div>
    );
  }

  return (
    <div
      className="text-14 font-inter font-normal mb-3 pb-3 overflow-hidden h-full text-black opacity-80 leading-26 line-clamp-4"
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
