import { Popover, Tag } from "antd";
import HandIcon from "./handIcon";

const ScoreTag = ({ topic_score, hideRank = false, isPercentage = false }) => {
  const popoverContent = () => (
    <p>
      To view the support on this topic, you need to add your direct support
      or delegate support to another user first.
    </p>
  );

  // Treat NaN, null, undefined as invalid, but allow 0 as valid
  const isValidScore = typeof topic_score === "number" && !isNaN(topic_score);

  const scoreToShow = isValidScore ? topic_score.toFixed(2) : "0.00";

  if (!isValidScore || hideRank) {
    return (
      <Popover
        placement="topLeft"
        content={popoverContent}
        overlayStyle={{ width: "20%" }}
      >
        <Tag
          id="score-tag"
          className="bg-canOrange text-white border-0 rounded-md ml-1 inline-flex py-[2px] flex items-center text-[10px] scoreTag"
        >
          <HandIcon />
          <span>{scoreToShow}</span>
        </Tag>
      </Popover>
    );
  }

  return (
    <Tag
      id="score-tag"
      className="bg-canOrange text-white border-0 rounded-md ml-1 inline-flex py-[2px] flex items-center text-[10px] scoreTag"
    >
      <HandIcon />
      {scoreToShow} {isPercentage ? "%" : ""}
    </Tag>
  );
};

export default ScoreTag;
