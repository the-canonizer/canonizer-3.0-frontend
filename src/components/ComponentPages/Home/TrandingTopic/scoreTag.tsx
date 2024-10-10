import { Tag } from "antd";

import HandIcon from "./handIcon";

const ScoreTag = ({ topic_score }) => {
  // if (!topic_score) return null;

  return (
    <Tag
      className={
        "bg-canOrange text-white border-0 rounded-md ml-1 inline-flex py-[2px] flex items-center text-[10px] scoreTag"
      }
    >
      <HandIcon />
      {topic_score?.toFixed(2)}
    </Tag>
  );
};

export default ScoreTag;
