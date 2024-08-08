import { Fragment, useState } from "react";
import { Card, Typography, Tooltip, Space, Popconfirm } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import moment from "moment";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";

import { getTime } from "src/utils/generalUtility";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import EditIcon from "./editIcon";
import DeleteIcon from "./deleteIcon";

const { Text } = Typography;

const SinglePost = ({
  postedTime = null,
  content = null,
  postedUpdatedTime = null,
  nick_name = "",
  onEditClick,
  onDeleteClick,
  post,
}) => {
  const [showFullDescription, setFullDescription] = useState(false);

  const showFullDescriptionHandler = () => {
    setFullDescription(!showFullDescription);
  };

  const description = showFullDescription ? content : content?.slice(0, 500);

  return (
    <Card className=" mb-4 rounded-xl" bodyStyle={{ padding: "15px" }}>
      <div className="mb-3">
        <Space size="small">
          <Text strong id={"post-title-" + post.id}>
            <Link
              href={`/user/supports/${post["user_id"] || ""}?canon=${
                post["namespace_id"] || 1
              }`}
              passHref
            >
              <a className="">{nick_name}</a>
            </Link>
            <Text>
              {new Date(postedTime).getTime() ===
              new Date(postedUpdatedTime).getTime() ? (
                <Text className="ml-1 font-medium text-sm">
                  edited comment{" "}
                  {moment(getTime(postedTime))
                    .local()
                    .startOf("seconds")
                    .fromNow()}{" "}
                  <Text className="ml-1 text-xs text-canLight">
                    (
                    {moment(getTime(postedTime)).format(
                      "MMM Do YYYY, h:mm:ss A"
                    )}
                    )
                  </Text>
                </Text>
              ) : (
                <Text className="ml-1 font-medium text-sm">
                  updated{" "}
                  {moment(getTime(postedUpdatedTime))
                    .local()
                    .startOf("seconds")
                    .fromNow()}{" "}
                  <Text className="ml-1 text-xs text-canLight">
                    (
                    {moment(getTime(postedUpdatedTime)).format(
                      "MMM Do YYYY, h:mm:ss A"
                    )}
                    )
                  </Text>
                </Text>
              )}
            </Text>
          </Text>
          {post?.is_my_post ? (
            <Fragment>
              <Tooltip title="Edit Comment">
                <SecondaryButton
                  onClick={onEditClick}
                  className="linkCss border-0 p-0"
                  id={"post-edit-icon" + post.id}
                  data-testid={"post-edit-icon" + post.id}
                >
                  <EditIcon />
                </SecondaryButton>
              </Tooltip>
              {/* <Popconfirm
                title="Are you sure you want to delete the post?"
                onConfirm={onDeleteClick}
                okText="Yes"
                cancelText="No"
                data-testid="delete_pop_confirm"
              > */}
              <Tooltip title="Delete Comment">
                <SecondaryButton
                  onClick={onDeleteClick}
                  className="linkCss border-0 p-0"
                  id={"post-delete-icon-" + post.id}
                  data-testid={"post-delete-icon-" + post.id}
                >
                  <DeleteIcon />
                </SecondaryButton>
              </Tooltip>
              {/* </Popconfirm> */}
            </Fragment>
          ) : null}
        </Space>
      </div>

      <div
        className={
          "text-canBlack opacity-80 [&_*]:ml-0 [&_*]:pl-0 [&_ol]:pl-4 ql-editor ql-html-editor"
        }
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(`<div class="ck-content">${description}</div>`, {
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
      ></div>
      {content?.length > 500 && (
        <SecondaryButton
          onClick={showFullDescriptionHandler}
          className="text-xs border-0 p-0 text-canBlue hocus:text-canHoverBlue mt-5"
        >
          Read{" "}
          {showFullDescription ? (
            <Text className="ml-1 text-xs text-canBlue hocus:text-canHoverBlue">
              Less{" "}
              <MinusOutlined className="text-xs ml-1 text-canBlue hocus:text-canHoverBlue" />
            </Text>
          ) : (
            <Text className="ml-1 text-xs text-canBlue hocus:text-canHoverBlue">
              More
              <PlusOutlined className="text-xs ml-1 text-canBlue hocus:text-canHoverBlue" />
            </Text>
          )}
        </SecondaryButton>
      )}
    </Card>
  );
};

export default SinglePost;
