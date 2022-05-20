import { Fragment } from "react";
import { Card, Typography, Pagination } from "antd";
import moment from "moment";
import Link from "next/link";

import styles from "../Forum.module.scss";

import PostForm from "./Form";
import PostList from "./List";
import { getTime } from "../../../../../utils/generalUtility";

const { Text } = Typography;

const PostUI = ({
  onFinishPost,
  onCancel,
  formPost,
  initialValue,
  nickNameList,
  postList,
  pCurrent,
  pTotal,
  pOnChange,
  quillContent,
  onContentChange,
  isError,
  onDeleteClick,
  onEditClick,
  currentThread,
  isLog,
}) => {
  return (
    <Fragment>
      <Card
        title={
          <span className={styles.cardTitle}>{currentThread["title"]}</span>
        }
        className={`can-card-style ${styles.forum_post_card}`}
        extra={
          <div className={styles.threadStamp}>
            <Text>{`Thread Created at ${moment(
              getTime(currentThread["created_at"])
            ).format("MMM Do YYYY, h:mm:ss a")}`}</Text>{" "}
            |{" "}
            <Text>
              Started by{" "}
              <Link href="#">
                <a className={styles.by}>
                  {currentThread["creation_nick_name"]}
                </a>
              </Link>
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
          postCount={pTotal}
          quillContent={quillContent}
          onContentChange={onContentChange}
          isError={isError}
          isLog={isLog}
        />

        {postList.map((post) => (
          <PostList
            postedBy={post.post_by}
            postedTime={post.created_at}
            postedUpdatedTime={post.updated_at}
            content={post.body}
            nick_name={post.nick_name}
            key={post.id}
            onEditClick={onEditClick.bind(this, post)}
            onDeleteClick={onDeleteClick.bind(this, post.id)}
            post={post}
          />
        ))}

        <div className={`paginationCon`}>
          {pTotal > 10 ? (
            <Pagination
              current={pCurrent}
              onChange={pOnChange}
              total={pTotal}
            />
          ) : null}
        </div>
      </Card>
    </Fragment>
  );
};

export default PostUI;
