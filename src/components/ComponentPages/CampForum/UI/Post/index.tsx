import { Fragment } from "react";
import { Card, Typography, Pagination, Popover } from "antd";
import moment from "moment";
import Link from "next/link";

import styles from "../Forum.module.scss";

import PostForm from "./Form";
import PostList from "./List";
import { getTime } from "../../../../../utils/generalUtility";
import CustomSkelton from "../../../../common/customSkelton";

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
  isLoading,
  postperPage,
  threadDetailsLoading,
}) => {
  return (
    <Fragment>
      <Card
        title={
          threadDetailsLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass=""
              listStyle="liHeight"
              isButton={false}
            />
          ) : (
            <Popover
              content={currentThread["title"]}
              key={currentThread["created_at"]}
              placement="topLeft"
            >
              <span className={styles.cardTitle} id="card-title">
                {currentThread["title"]}
              </span>
            </Popover>
          )
        }
        className={`can-card-style ${styles.forum_post_card}`}
        extra={
          <div className={styles.threadStamp}>
            {threadDetailsLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass=""
                listStyle="liWidth"
                isButton={false}
              />
            ) : (
              <Fragment>
                <Text id="thread-create-label">{`Thread Created at ${moment(
                  getTime(currentThread["created_at"])
                ).format("MMM Do YYYY, h:mm:ss a")}`}</Text>{" "}
                |{" "}
                <Text id="started-by-label">
                  Started by{" "}
                  <Link
                    href={`/user/supports/${
                      currentThread["creation_nick_name_id"] || ""
                    }?topicnum=${currentThread["topic_id"] || ""}&campnum=${
                      currentThread["camp_id"] || ""
                    }&canon=${currentThread["namespace_id"] || 1}`}
                    passHref
                  >
                    <a className={styles.by}>
                      {currentThread["creation_nick_name"]}
                    </a>
                  </Link>
                </Text>
              </Fragment>
            )}
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
          isLoading={isLoading}
        />

        {isLoading ? (
          <CustomSkelton
            skeltonFor="post_card"
            bodyCount={1}
            stylingClass=""
            listStyle=""
            isButton={false}
          />
        ) : (
          postList.map((post) => (
            <PostList
              postedTime={post.created_at}
              postedUpdatedTime={post.updated_at}
              content={post.body}
              nick_name={post.nick_name}
              key={post.id}
              onEditClick={onEditClick.bind(this, post)}
              onDeleteClick={onDeleteClick.bind(this, post.id)}
              post={post}
            />
          ))
        )}

        <div className={`paginationCon`}>
          {isLoading ? (
            <CustomSkelton
              skeltonFor="list"
              bodyCount={1}
              stylingClass=""
              listStyle="liHeight"
              isButton={false}
            />
          ) : pTotal > postperPage ? (
            <Pagination
              current={pCurrent}
              onChange={pOnChange}
              total={pTotal}
              showSizeChanger={false}
            />
          ) : null}
        </div>
      </Card>
    </Fragment>
  );
};

export default PostUI;
