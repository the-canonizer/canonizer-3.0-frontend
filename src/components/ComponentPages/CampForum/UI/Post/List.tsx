import { Fragment } from "react";
import { Card, Typography, Tooltip, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../Forum.module.scss";
import { getTime } from "../../../../../utils/generalUtility";

const { Text } = Typography;

const CreateCampFormUI = ({
  postedTime = null,
  content = null,
  postedUpdatedTime = null,
  nick_name = "",
  onEditClick,
  onDeleteClick,
  post,
}) => {
  const router = useRouter();

  return (
    <Fragment>
      <Card className={styles.listCard} bodyStyle={{ padding: "15px" }}>
        <div className={`${styles.cardTitle} ${styles.listCardTitle}`}>
          <Space size="small">
            <Text strong id={"post-title-" + post.id}>
              <Link
                href={`/user/supports/${post["user_id"] || ""}?topicnum=${
                  (router?.query?.topic as string)?.split("-")[0] || ""
                }&campnum=${
                  (router?.query?.camp as string)?.split("-")[0] || ""
                }&namespace=${post["namespace_id"] || 1}`}
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
                  >
                    <EditOutlined />
                  </a>
                </Tooltip>
                <Popconfirm
                  title="Are you sure you want to delete the post?"
                  onConfirm={onDeleteClick}
                  okText="Yes"
                  cancelText="No"
                >
                  <a className="linkCss" id={"post-delete-icon-" + post.id}>
                    <DeleteOutlined />
                  </a>
                </Popconfirm>
              </Fragment>
            ) : null}
          </Space>
        </div>
        <div
          className={styles.htmlContainer + " ql-editor ql-html-editor"}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
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
      </Card>
    </Fragment>
  );
};

export default CreateCampFormUI;
