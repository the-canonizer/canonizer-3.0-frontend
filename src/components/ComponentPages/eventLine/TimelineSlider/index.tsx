import { PauseOutlined, ShareAltOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Popover,
  Radio,
  RadioChangeEvent,
  Slider,
  Space,
  Tooltip,
  Typography,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { isServer } from "src/utils/generalUtility";
import CheckIcon from "../../../../assets/image/check.png";
import CopyLinkIcon from "../../../../assets/image/copy-link.png";

const { Title } = Typography;

const marks = {
  0: "0.1x",
  12.5: "0.25x",
  25.0: "0.5x",
  37.5: "0.75x",
  50.0: "1x",
  62.5: "2.5x",
  75.0: "5x",
  87.5: "7.5x",
  100: "10x",
};

function TimelineSlider({
  mockData,
  setStart,
  start,
  setTimelineDescript,
  handleEventSelection,
  animationSpeed,
  setAnimationSpeed,
  iteration,
  setIteration,
  handleForwardOrBackord,
  isPlaying,
  setIsPlaying,
}: // eventId,
// setEventId,
// value,
// setValue,
any) {
  const router = useRouter();
  const didMount = useRef(false);
  const [intervalId, setIntervalId] = useState(null);
  const [speedBar, setSpeedBar] = useState(false);
  const [URL, setURL] = useState("");
  const [eventId, setEventId] = useState<any>(0);
  const [value, setValue] = useState(1);

  const updateEventId = (url, newValue) => {
    let urlParts = url.split("?");
    let baseUrl = urlParts[0];
    let params = urlParts[1].split("&");

    for (let i = 0; i < params.length; i++) {
      let paramParts = params[i].split("=");
      if (paramParts[0] === "eventId") {
        paramParts[1] = newValue;
        params[i] = paramParts.join("=");
        break; // Found eventId, no need to continue looping
      }
    }

    return baseUrl + "?" + params.join("&");
  };

  const optionChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);

    if (e.target.value == 1) {
      if (router.asPath.includes("?")) {
        setURL(!isServer() && window?.location?.href?.split("?")[0]);
      } else {
        setURL(!isServer() && window?.location?.href);
      }
    } else if (e.target.value == 2) {
      if (router.asPath.includes("?")) {
        if (router.asPath.includes("eventId")) {
          setURL(updateEventId(window?.location?.href, eventId));
        } else {
          setURL(window?.location?.href + `&eventId=${eventId}`);
        }
      } else {
        setURL(window?.location?.href + `?eventId=${eventId}`);
      }
    }
  };

  const copyHandler = () => {
    if (value == 1) {
      if (router.asPath.includes("?")) {
        setURL(!isServer() && window?.location?.href?.split("?")[0]);
      } else {
        setURL(!isServer() && window?.location?.href);
      }
    } else if (value == 2) {
      if (router.asPath.includes("?")) {
        if (router.asPath.includes("eventId")) {
          setURL(updateEventId(window?.location?.href, eventId));
        } else {
          setURL(window?.location?.href + `&eventId=${eventId}`);
        }
      } else {
        setURL(window?.location?.href + `?eventId=${eventId}`);
      }
    }
  };

  useEffect(() => {
    if (value == 1) {
      if (router.asPath.includes("?")) {
        setURL(!isServer() && window?.location?.href?.split("?")[0]);
      } else {
        setURL(!isServer() && window?.location?.href);
      }
    } else if (value == 2) {
      if (router.asPath.includes("?")) {
        if (router.asPath.includes("eventId")) {
          setURL(updateEventId(window?.location?.href, eventId));
        } else {
          setURL(window?.location?.href + `&eventId=${eventId}`);
        }
      } else {
        setURL(window?.location?.href + `?eventId=${eventId}`);
      }
    }
  }, [eventId, value]);

  useEffect(() => {
    if (!didMount.current) {
      if (router?.asPath.includes("eventId")) {
        setIteration(+router?.query?.eventId);
        handleEventSelection(+router?.query?.eventId);
        setEventId(+router?.query?.eventId);
      }
      didMount.current = true;
    }
  }, [eventId]);

  const handleClick = () => {
    setStart(!start);
    if (isPlaying) {
      clearInterval(intervalId);
      setIntervalId(null);
      setIsPlaying(false);
      setEventId(iteration);
    } else {
      const id = setInterval(() => {
        if (isPlaying && start) {
          setIteration((c) => c + 1);
        }
      }, animationSpeed);

      setIntervalId(id);
      setIsPlaying(true);
      setEventId(iteration);
    }
    setValue(1);
  };
  const handleClickForward = () => {
    setIsPlaying(false);
    setStart(false);
    if (Object.keys(mockData).length - 1 !== iteration) {
      setIteration(iteration + 1);
      setEventId(iteration + 1);
      setValue(1);

      handleForwardOrBackord(iteration + 1);
    }

    // }
  };

  const handleClickBackword = () => {
    setIsPlaying(false);
    setStart(false);
    if (iteration > 0) {
      setIteration(iteration - 1);
      setEventId(iteration - 1);
      setValue(1);

      handleForwardOrBackord(iteration - 1);
    }
  };
  const onChange = (newValue) => {
    if (Object.keys(mockData).length == newValue) {
      setIsPlaying(false);
    }
    setValue(1);

    {
      Object.keys(mockData)?.map((key) => {
        //Search the current iteration in data
        key?.split("_")[2] == newValue && setEventId(key?.split("_")[2]);
      });
    }

    setIteration(newValue);
    handleEventSelection(newValue);
  };

  const handleSpeedChange = (playbackSpeed) => {
    switch (playbackSpeed) {
      case 0:
        setAnimationSpeed(1350);
        break;
      case 12.5:
        setAnimationSpeed(1200);
        break;
      case 25.0:
        setAnimationSpeed(1050);
        break;
      case 37.5:
        setAnimationSpeed(900);
        break;
      case 50.0:
        setAnimationSpeed(750);
        break;
      case 62.5:
        setAnimationSpeed(600);
        break;
      case 75.0:
        setAnimationSpeed(450);
        break;
      case 87.5:
        setAnimationSpeed(300);
        break;
      case 100:
        setAnimationSpeed(150);
        break;
      default:
      // do nothing
    }

    setSpeedBar(false);
  };

  const controller_content = (
    <div className="speed-controller">
      <Title level={5}>Playback speed</Title>
      <Slider
        marks={marks}
        defaultValue={50}
        step={null}
        tooltip={{ open: false }}
        onChange={handleSpeedChange}
        data-testid="slider"
      />
    </div>
  );
  const DateFormate = (datess, value = null) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // let formattedDate = `${
    //   months[datess.getMonth()]
    // } ${datess.getDate()}, ${datess
    //   .getYear()
    //   .toString()
    //   .slice(1)}<span style=display:none>${value}</span>`;

    const day = datess.getDate();
    const month = months[datess.getMonth()];
    const year = datess.getFullYear().toString().slice(-2);

    const formattedDate = `${day} ${month}, ${year}<span style="display:none">${value}</span>`;

    return (
      <div
        dangerouslySetInnerHTML={{
          __html: formattedDate,
        }}
      />
    );
  };

  const formatter = (value) => {
    let pdata: any = Object.keys(mockData)?.sort();
    let formatedDate =
      pdata.length > 0 &&
      DateFormate(new Date(pdata[value]?.split("_")[1] * 1000), value);
    return formatedDate;
  };
  const MarkPointsData = () => {
    let pdata: any =
      mockData &&
      Object.keys(mockData)?.length > 0 &&
      Object.keys(mockData)?.sort();

    let obj = {};

    if (typeof window !== "undefined" && window.innerWidth > 767) {
      if (pdata?.length > 0 && pdata.length - 1 < 4) {
        pdata.map((value, index) => {
          let formattedDate = DateFormate(
            new Date(value?.split("_")[1] * 1000)
          );
          obj[index] = formattedDate;
        });
      } else {
        pdata?.length > 0 &&
          pdata?.map((value, index) => {
            if (index == 0) {
              obj[index] = DateFormate(new Date(value?.split("_")[1] * 1000));
            }
            let pointDiff = (index + 1) * ((pdata.length - 1) / 4);
            if (Math.round(pointDiff) < pdata.length) {
              let datess = new Date(
                pdata[Math.round(pointDiff)]?.split("_")[1] * 1000
              );
              let formattedDate = DateFormate(datess);
              obj[Math.round(pointDiff)] = formattedDate;
            }
          });
      }
    } else {
      pdata?.length > 0 &&
        pdata.map((value, index) => {
          if (index == 0) {
            obj[index] = DateFormate(new Date(value?.split("_")[1] * 1000));
          }
          let pointDiff = (index + 1) * ((pdata.length - 1) / 2);
          if (Math.round(pointDiff) < pdata.length) {
            let datess = new Date(
              pdata[Math.round(pointDiff)]?.split("_")[1] * 1000
            );
            let formattedDate = DateFormate(datess);
            obj[Math.round(pointDiff)] = formattedDate;
          }
        });
    }
    return obj;
  };
  useEffect(() => {
    if (Object.keys(mockData).length == iteration) {
      setIsPlaying(false);
      setIteration(0);
      setStart(false);
    }
    let showkey = Object.keys(mockData).sort()[iteration];
    let sortMockData = Object.keys(mockData).sort();
    let mappedArr = [];
    for (let i = 0; i < Object.keys(mockData).length; i++) {
      if (showkey == sortMockData[i]) {
        mappedArr.unshift({
          message: mockData[sortMockData[i]]?.event?.message,
          eventDate: sortMockData[i]?.split("_")[1],
          id: mockData[sortMockData[i]]?.event?.id,
          url: mockData[sortMockData[i]]?.event?.url,
        });
        break;
      }

      mappedArr.unshift({
        message: mockData[sortMockData[i]]?.event?.message,
        eventDate: sortMockData[i]?.split("_")[1],
        id: mockData[sortMockData[i]]?.event?.id,
        url: mockData[sortMockData[i]]?.event?.url,
      });
    }
    setTimelineDescript(mappedArr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iteration, mockData]);

  const content = (
    <div className="share-popup-content">
      <Title level={5}>Share</Title>
      <Radio.Group onChange={optionChange} value={value}>
        <Space direction="vertical">
          <Radio value={1}>Eventline URL</Radio>
          <Radio value={2}>Current Event URL</Radio>
        </Space>
      </Radio.Group>
      <Divider className="my-3" />
      <div className="social-links">
        <Title level={5} className="mb-0">
          Share Link To
        </Title>
        <Space>
          <FacebookShareButton
            url={URL}
            hashtag={`#${!isServer() && window?.location?.hostname}`}
          >
            <Tooltip title="Share On Facebook">
              <FacebookIcon size={27} round />
            </Tooltip>
          </FacebookShareButton>

          <TwitterShareButton url={URL}>
            <Tooltip title="Share On Twitter">
              <TwitterIcon size={27} round />
            </Tooltip>
          </TwitterShareButton>

          <LinkedinShareButton url={URL}>
            <Tooltip title="Share On Linkedin">
              <LinkedinIcon size={27} round />
            </Tooltip>
          </LinkedinShareButton>
          <>
            <Paragraph
              className="!mb-0 copy-btn"
              copyable={{
                text: URL,
                icon: [
                  <img
                    src={CopyLinkIcon.src}
                    key="1"
                    style={{ verticalAlign: "baseline" }}
                    onClick={() => copyHandler()}
                  />,
                  <img
                    src={CheckIcon.src}
                    key="2"
                    style={{ verticalAlign: "baseline" }}
                  />,
                ],
              }}
            ></Paragraph>
          </>
        </Space>
      </div>
    </div>
  );

  return (
    <>
      <div className="player-wrapper">
        <div
          className={`${"player-controller"} ${
            mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent
              ? ""
              : ""
          }`}
          data-testid="time-bar-control"
        >
          <i
            className="icon-control-btn-2"
            onClick={() => {
              if (mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent) {
                handleClickBackword();
              }
            }}
            data-testid="backward-button"
          ></i>
          {"     "}
          <div
            onClick={() => {
              if (mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent) {
                handleClick();
              }
            }}
            data-testid="play-button"
          >
            {isPlaying ? <PauseOutlined /> : <i className="icon-play-btn"></i>}
          </div>
          {"   "}

          <i
            className="icon-control-btn"
            onClick={() => {
              if (mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent) {
                handleClickForward();
              }
            }}
            data-testid="forward-button"
          ></i>
          <Popover
            content={controller_content}
            title={false}
            trigger="hover"
            overlayClassName="sp-controller-wrapper"
            open={speedBar}
            // open
            onOpenChange={(newOpen) => {
              setSpeedBar(newOpen);
            }}
          >
            <i
              className={`${"icon-timer cursor-pointer"}  ${
                mockData && mockData[Object.keys(mockData)[1]]?.firstEvent
                  ? "disable-icon"
                  : ""
              }`}
              data-testid="speed-icon"
            ></i>
          </Popover>
        </div>
        <div className="share-wrapper">
          <Popover
            showArrow={false}
            content={content}
            overlayClassName="share-popover-wrapper"
            trigger="click"
            placement="bottomLeft"
          >
            <Button
              type="link"
              className="text-canBlack"
              icon={<ShareAltOutlined />}
              size="small"
            />
          </Popover>
        </div>
      </div>
      {mockData && (
        <Slider
          disabled={
            mockData && !mockData[Object.keys(mockData)[1]]?.firstEvent
              ? false
              : true
          }
          className={`${
            mockData && Object.keys(mockData).length > 0
              ? "rang-slider"
              : "skeleton-rangslider"
          }`}
          tooltip={{
            open: true,
            formatter,
            getPopupContainer: (triggerNode) => triggerNode.parentElement,
          }}
          onChange={onChange}
          value={Number(iteration)}
          marks={MarkPointsData()}
          min={0}
          max={Object?.keys(mockData).length - 1}
          data-testid="slider"
        />
      )}
    </>
  );
}

export default TimelineSlider;
