import { Fragment } from "react";
import { Card, Typography } from "antd";

import styles from "../Forum.module.scss";

import PostForm from "./Form";
import PostList from "./List";

const { Text } = Typography;

const PostUI = ({
  onFinishPost,
  onCancel,
  formPost,
  initialValue,
  nickNameList,

  threadStamps,
  startedBy,
  postCount = 0,
  postList,
  cardTitle,
}) => {
  const CardTitle = <span className={styles.cardTitle}>{cardTitle}</span>;

  return (
    <Fragment>
      <Card
        title={CardTitle}
        className="can-card-style"
        extra={
          <div className={styles.threadStamp}>
            <Text>{threadStamps}</Text> |{" "}
            <Text>
              Started by <span className={styles.by}>{startedBy}</span>
            </Text>
          </div>
        }
      >
        <PostForm
          onFinish={onFinishPost}
          onCancel={onCancel}
          form={formPost}
          initialValue={initialValue}
          nickNameList={nickNameList}
          postCount={postCount}
        />
        {postList.map((post) => (
          <PostList
            postedBy={post.post_by}
            postedTime={post.time}
            title={post.title}
            content={post.content}
            key={post.id}
          />
        ))}
      </Card>
    </Fragment>
  );
};

export default PostUI;
