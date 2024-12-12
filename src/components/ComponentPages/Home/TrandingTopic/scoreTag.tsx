import { Popover, Tag } from "antd";

import HandIcon from "./handIcon";

const ScoreTag = ({ topic_score }) => {
  // if (!topic_score) return null;

  const popoverContent = () => {
    return (
      <>
        <p>To view the support on this topic, you need to add your direct support or delegate support to another user first.</p>
      </>
    );
  };

  return (
    <>
      {topic_score == 0 ? (
          <Popover placement={"topLeft"} content={popoverContent} style={{ width: "50%" }}>
            <Tag
              id="score-tag"
              className={
                "bg-canOrange text-white border-0 rounded-md ml-1 inline-flex py-[2px] flex items-center text-[10px] scoreTag"
              }
            >
              <HandIcon />
              {topic_score?.toFixed(2)}
            </Tag>
          </Popover>
      ) : (
          <Tag
            id="score-tag"
            className={
              "bg-canOrange text-white border-0 rounded-md ml-1 inline-flex py-[2px] flex items-center text-[10px] scoreTag"
            }
          >
            <HandIcon />
            {topic_score?.toFixed(2)}
          </Tag>
      )}
    </>
  );
};

export default ScoreTag;
