import { Fragment } from "react";
import { Card, Typography, Tooltip, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import styles from "../Forum.module.scss";

const { Text } = Typography;

const CreateCampFormUI = ({
  postedBy = null,
  postedTime = null,
  title = null,
  content = null,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Fragment>
      <Card className={styles.listCard} bodyStyle={{ padding: "15px" }}>
        <div className={`${styles.cardTitle} ${styles.listCardTitle}`}>
          <Space size="small">
            <Text>
              <span className={styles.by}>{postedBy}</span> {postedTime}
            </Text>
            <Tooltip title="edit">
              <a onClick={onEditClick} className="linkCss">
                <EditOutlined />
              </a>
            </Tooltip>
            <Tooltip title="delete">
              <a onClick={onDeleteClick} className="linkCss">
                <DeleteOutlined />
              </a>
            </Tooltip>
          </Space>
        </div>
        {title ? (
          <Fragment>
            {" "}
            <Text strong>{title}</Text>
            <br />
          </Fragment>
        ) : null}
        <Text>{content}</Text>
      </Card>
    </Fragment>
  );
};

export default CreateCampFormUI;
