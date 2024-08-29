import sanitizeHtml from "sanitize-html";

import CustomSkelton from "components/common/customSkelton";

function StatementDescPreview({ statement, isLoading }) {
  return isLoading ? (
    <CustomSkelton
      bodyCount
      stylingClass
      isButton
      height={150}
      skeltonFor="video"
    />
  ) : (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(statement, {
          selfClosing: ["img", "br", "hr"],
          allowedTags: [
            "address",
            "article",
            "aside",
            "footer",
            "header",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "hgroup",
            "main",
            "nav",
            "section",
            "blockquote",
            "dd",
            "div",
            "dl",
            "dt",
            "figcaption",
            "figure",
            "hr",
            "li",
            "main",
            "ol",
            "p",
            "pre",
            "ul",
            "a",
            "abbr",
            "b",
            "bdi",
            "bdo",
            "br",
            "cite",
            "code",
            "data",
            "dfn",
            "em",
            "i",
            "kbd",
            "mark",
            "q",
            "rb",
            "rp",
            "rt",
            "rtc",
            "ruby",
            "s",
            "samp",
            "small",
            "span",
            "strong",
            "sub",
            "sup",
            "time",
            "u",
            "var",
            "wbr",
            "caption",
            "col",
            "colgroup",
            "table",
            "tbody",
            "td",
            "tfoot",
            "th",
            "thead",
            "tr",
            "img",
          ],
          allowedSchemes: ["http", "https", "ftp", "mailto", "tel"],
          allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
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
            img: [
              "src",
              "srcset",
              "alt",
              "title",
              "width",
              "height",
              "loading",
            ],
          },
        }),
      }}
      className="text-canBlack rounded-sm h-full editorContent"
    ></div>
  );
}

export default StatementDescPreview;
