import { Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import PropTypes from "prop-types";

import CommonCard from "components/shared/Card";
import ViewCounts from "components/shared/ViewsCount";
import AvatarGroup from "components/shared/AvaratGroup";
import CardDescription from "./descriptions";
import TopicCatsLabel from "components/shared/TopicCategories";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { useIsMobile } from "src/hooks/useIsMobile";
import Video from "src/pages/videos/[...video]";

const propTypes = {
  topic: PropTypes.object,
  avatars: PropTypes.array,
  scoreTag: PropTypes.any,
  onTopicLinkClick: PropTypes.func,
  tag_key: PropTypes.string,
  maxCount: PropTypes.number,
  cardClassName: PropTypes.string,
  copyLink: PropTypes.any,
  imageBaseURL: PropTypes.string,
  descriptionTextLength: PropTypes.number,
};

const SingleVideoCard = ({
  video,
  onVideoLinkClick = null,
  descriptionTextLength = 220,
}) => {
  const isMobile = useIsMobile();

  if (!video) {
    return null;
  }

  return (
    <a
      href={video?.video_link}
      target="_blank" 
      rel="noopener noreferrer"
    >
        <CommonCard
          className={
            "hover:cursor-pointer border-0 h-full transition duration-300 hocus:shadow-lg [&_.rightArrow]:hover:block mainCard hocus:bg-white [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:h-full fullHeightCard [&_.ant-card-body]:before:hidden [&_.ant-card-body]:after:hidden [&_.ant-card-body]:p-[15px] "
          }
          key={video?.id}
          id={`common-card-${video?.id}`}
        >
          <div
            className="flex justify-between pb-3 items-center"
            onClick={onVideoLinkClick}
            id={`card-header-${video?.id}`}
          >
            <Typography.Text
              id={`browse-topic-name-${video?.id}`}
              className="flex w-11/12 items-center"
            >
              <Typography.Paragraph
                id={`topic-name-${video?.id}`}
                className="m-0 text-sm 2xl:text-base font-medium font-inter !mb-0 line-clamp-1"
              >
                {video?.title}
              </Typography.Paragraph>
            </Typography.Text>
            <RightOutlined
              id={`right-arrow-${video?.id}`}
              className="text-canBlue font-bold hidden rightArrow"
            />
          </div>
          <div>
          
              <iframe 
                width={"100%"}
                height={"auto"}
                src={`${video?.video_link}?mute=1`}
                // src="" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                ></iframe>
              {/* <video
                  id="video-podcast-player"
                  width={"100%"}
                  height={"auto"}
                  controls
                >
                  <source
                    data-testid="video_podcast-playerId"
                    src={video?.video_link}
                    type="video/youtube"
                  />
                </video> */}
          </div>
            <CardDescription
            className="topicDesc"
            description={video?.description}
            descriptionTextLength={descriptionTextLength}
          />
        </CommonCard>
    </a>
  );
};

SingleVideoCard.propTypes = propTypes;

export default SingleVideoCard;
