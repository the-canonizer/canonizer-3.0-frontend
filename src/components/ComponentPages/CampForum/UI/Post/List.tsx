import { Fragment } from "react";
import { Card, Typography, Tooltip, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";

import styles from "../Forum.module.scss";

import { getTime } from "src/utils/generalUtility";

const { Text } = Typography;

const CreateCampFormUI = ({
  postedTime = null,
  content = null,
  postedUpdatedTime = null,
  nick_name = "",
  onEditClick,
  onDeleteClick,
  post,
}: any) => (
  <Fragment>
    <Card className={styles.listCard} bodyStyle={{ padding: "15px" }}>
      <div className={`${styles.cardTitle} ${styles.listCardTitle}`}>
        <Space size="small">
          <Text strong id={"post-title-" + post.id}>
            <Link
              href={`/user/supports/${post["user_id"] || ""}?canon=${
                post["namespace_id"] || 1
              }`}
              passHref
            >
              <a className={styles.by}>{nick_name}</a>
            </Link>
            {new Date(postedTime).getTime() ===
            new Date(postedUpdatedTime).getTime()
              ? ` replied ${moment(getTime(postedTime))
                  .local()
                  .startOf("seconds")
                  .fromNow()} (${moment(getTime(postedTime)).format(
                  "MMM Do YYYY, h:mm:ss a"
                )})`
              : ` updated ${moment(getTime(postedUpdatedTime))
                  .local()
                  .startOf("seconds")
                  .fromNow()} (${moment(getTime(postedUpdatedTime)).format(
                  "MMM Do YYYY, h:mm:ss a"
                )})`}
          </Text>
          {post.is_my_post ? (
            <Fragment>
              <Tooltip title="edit">
                <a
                  onClick={onEditClick}
                  className="linkCss"
                  id={"post-edit-icon" + post.id}
                  data-testid={"post-edit-icon" + post.id}
                >
                  <EditOutlined />
                </a>
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete the post?"
                onConfirm={onDeleteClick}
                okText="Yes"
                cancelText="No"
                data-testid="delete_pop_confirm"
              >
                <a
                  className="linkCss"
                  id={"post-delete-icon-" + post.id}
                  data-testid={"post-delete-icon-" + post.id}
                >
                  <DeleteOutlined />
                </a>
              </Popconfirm>
            </Fragment>
          ) : null}
        </Space>
      </div>
      {console.log("content000--", content)}
      <div
        className={styles.htmlContainer + " ql-editor ql-html-editor"}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(`<div class="ck-content">${content}</div>`, {
            // allowedTags: ["b", "i", "em", "strong", "a", "img"],
            selfClosing: [
              "img",
              "br",
              "hr",
              // "area",
              // "base",
              // "basefont",
              // "input",
              // "link",
              // "meta",
            ],
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
    </Card>
  </Fragment>
);

export default CreateCampFormUI;
