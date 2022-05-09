import { Fragment } from "react";
import { Card, Typography, Tooltip, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import sanitizeHtml from "sanitize-html";
import Link from "next/link";

import styles from "../Forum.module.scss";

const { Text } = Typography;

const CreateCampFormUI = ({
  postedBy = null,
  postedTime = null,
  content = null,
  postedUpdatedTime = null,
  nick_name = "",
  onEditClick,
  onDeleteClick,
  post,
}) => {
  return (
    <Fragment>
      <Card className={styles.listCard} bodyStyle={{ padding: "15px" }}>
        <div className={`${styles.cardTitle} ${styles.listCardTitle}`}>
          <Space size="small">
            <Text strong>
              <Link href="#">
                <a className={styles.by}>{nick_name}</a>
              </Link>
              {new Date(postedTime).getTime() ===
              new Date(postedUpdatedTime).getTime()
                ? ` replied ${moment(postedTime)
                    .local()
                    .startOf("seconds")
                    .fromNow()} (${moment(postedTime).format(
                    "MMM Do YYYY, h:mm:ss a"
                  )})`
                : `${nick_name} updated ${moment(postedUpdatedTime)
                    .local()
                    .startOf("seconds")
                    .fromNow()} (${moment(postedUpdatedTime).format(
                    "MMM Do YYYY, h:mm:ss a"
                  )})`}
            </Text>
            {post.is_my_post ? (
              <Fragment>
                <Tooltip title="edit">
                  <a onClick={onEditClick} className="linkCss">
                    <EditOutlined />
                  </a>
                </Tooltip>
                <Popconfirm
                  title="Are you sure to delete the news?"
                  onConfirm={onDeleteClick}
                  okText="Yes"
                  cancelText="No"
                >
                  <a className="linkCss">
                    <DeleteOutlined />
                  </a>
                </Popconfirm>
              </Fragment>
            ) : null}
          </Space>
        </div>
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}></div>
      </Card>
    </Fragment>
  );
};

export default CreateCampFormUI;
