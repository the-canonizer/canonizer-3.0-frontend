import styles from "./timeline.module.scss";
import React, { useEffect, useState } from "react";
import RacingBarChart from "./RacingBarChart";
import useInterval from "./useInterval";
// import "./App.css";
import TimelineSlider from "../eventLine/TimelineSlider";
import { getEventLineApi } from "src/network/api/topicEventLineAPI";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "src/store/index.js";
import CustomSkelton from "../../common/customSkelton";
import { Empty, Radio, Space, Typography, Tooltip, Popover, Button, message} from "antd";
import type { RadioChangeEvent } from 'antd';
import { ShareAltOutlined } from "@ant-design/icons";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from "next-share";
import CopyLinkIcon from '../../../assets/image/copy-link.png';
import CheckIcon from '../../../assets/image/check.png';
import { isServer } from "src/utils/generalUtility";

// const getRandomIndex = (array) => {
//   return Math.floor(array.length * Math.random());
// };

const { Title , Paragraph } = Typography;

function TimeLine({ setTimelineDescript, setLoadingEvents }: any) {
  const [loading, setLoading] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [start, setStart] = useState(false);
  const [mockData, setMockData] = useState({});
  // const [eventDescription, setEventDescription] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState(1);
  const router = useRouter();

  const events = mockData && Object.keys(mockData).sort();
  const [data, setData] = useState([]);
  const [URL, setURL] = useState('');
  const [eventId,setEventId] = useState(0);

  const { algorithm, score, asofdate, asof } = useSelector(
    (state: RootState) => ({
      algorithm: state.filters?.filterObject?.algorithm,
      score: state?.filters?.filterObject?.filterByScore,
      asofdate: state.filters?.filterObject?.asofdate,
      asof: state?.filters?.filterObject?.asof,
    })
  );

  useEffect(()=>{
    if(value == 1){
      if(router.asPath.includes("?")){
        setURL(!isServer() && window?.location?.href?.split("?")[0])
      }else{
        setURL(!isServer() && window?.location?.href)
      }
    }else if(value == 2){
      if(router.asPath.includes("?")){
        setURL(updateEventId(window?.location?.href,eventId))
      }else{
        setURL(window?.location?.href+`?eventId=${eventId}`)
      }}
  },[eventId, value])


  useEffect(() => {
    async function apiCall() {
      const data = await getEventLineApi({
        topic_num: router?.query?.camp[0]?.split("-")[0],
        algorithm: algorithm,
      });

      if (data && Object.keys(data).length == 1) {
        let a = new Date().getTime() / 1000;
        data[`asoftime_${Math.round(a)}`] = {
          ...data[Object.keys(data)[0]],
          firstEvent: true,
        };
      } else if (data && Object.keys(data).length > 1 && asof == "bydate") {
        let sortMockData = Object.keys(data).sort();
        let i = 0;
        for (i; i < Object.keys(data).length; i++) {
          if (
            JSON.stringify(asofdate) ==
            JSON.stringify(sortMockData[i]?.split("_")[1])
          ) {
            setIteration(i);
            break;
          }
        }
      }
      data && setMockData(data);
    }
    setLoading(true);
    setLoadingEvents(true);
    setIteration(0);
    setStart(false);
    setMockData({});
    setIsPlaying(false);

    apiCall();
    setLoadingEvents(false);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  useEffect(() => {
    setData(
      mockData[
        Object.keys(mockData)?.sort()[iteration]
      ]?.payload_response?.filter((item) => item.score >= score)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockData, score, isPlaying]);

  useInterval(() => {
    if (start && events.length > iteration) {
      setData(
        mockData[events[iteration]].payload_response?.filter(
          (item) => item.score >= score
        )
      );
      // setEventDescription(mockData[events[iteration]].event?.message);
      // if(isPlaying){
      setIteration(iteration + 1);
      // }
    }
  }, animationSpeed);

  const handleEventSelection = (index) => {
    setData(
      mockData[events[index]]?.payload_response?.filter(
        (item) => item.score >= score
      )
    );
    // setEventDescription(mockData[events[index]].event?.message);
    setIteration(index);
  };

  const handleForwardOrBackord = (iteration) => {
    setData(
      mockData[events[iteration]].payload_response?.filter(
        (item) => item.score >= score
      )
    );
    // setEventDescription(mockData[events[iteration]].event?.message);
  };

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
}

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);

    if(e.target.value == 1){
      if(router.asPath.includes("?")){
        setURL(!isServer() && window?.location?.href?.split("?")[0])
      }else{
        setURL(!isServer() && window?.location?.href)
      }
    }else if(e.target.value == 2){
      if(router.asPath.includes("?")){
        setURL(updateEventId(window?.location?.href,eventId))
      }else{
        setURL(window?.location?.href+`?eventId=${eventId}`)
      }
    }
  };

  const copyHandler = () => {
    if(value == 1){
      if(router.asPath.includes("?")){
        setURL(!isServer() && window?.location?.href?.split("?")[0])
      }else{
        setURL(!isServer() && window?.location?.href)
      }
    }else if(value == 2){
      if(router.asPath.includes("?") && router.asPath.includes("eventId")){
        setURL(updateEventId(window?.location?.href,eventId))
      }else{
        setURL(window?.location?.href+`?eventId=${eventId}`)
      }
    }
  }

  const content = (
    <div className={styles.popoverWrapper}>
      <Title level={5}>Share</Title>
    <Radio.Group onChange={onChange} value={value}>
    <Space direction="vertical">
      <Radio value={1}>Eventline URL</Radio>
      <Radio value={2}>Current Event URL</Radio>
    </Space>
  </Radio.Group>
  <Space align={"center"} className={styles.shareLink} >
    <Title level={5}> Share Link To: </Title>
    <Space>
        <FacebookShareButton
         url={URL}
         hashtag={`#${!isServer() && window?.location?.hostname}`}
        >
          <Tooltip title="Share On Facebook">
            <FacebookIcon size={27} round/>
          </Tooltip>
        </FacebookShareButton>
      
        <TwitterShareButton url={URL}>
          <Tooltip title="Share On Twitter">
           <TwitterIcon size={27} round/>
          </Tooltip>
        </TwitterShareButton>
        
        <LinkedinShareButton url={URL}>
          <Tooltip title="Share On Linkedin">
            <LinkedinIcon size={27} round/>
          </Tooltip>
        </LinkedinShareButton> 
          <>
            <Paragraph
              disabled
              className={styles.typographyLink}
              copyable={{
              text: URL,
              icon: [<img src={CopyLinkIcon.src} style={{verticalAlign: "baseline"}}  onClick={() => copyHandler()}/> , <img src={CheckIcon.src} style={{verticalAlign: "baseline"}} /> ]}}
              >
            </Paragraph>
          </>
      </Space>
  </Space>
  </div>
  );

  return (
    <React.Fragment>
      {loading || !data ? (
        <CustomSkelton
          skeltonFor="playButtons"
          bodyCount={4}
          isButton={false}
          stylingClass=""
        />
      ) : (
        <>
        <Popover content={content} trigger="click" placement="leftBottom" >
            <Button type="primary" size="middle" className={styles.btnShareURL} ghost icon={<ShareAltOutlined />}>Share</Button>
        </Popover>
        <TimelineSlider
          mockData={mockData}
          setStart={setStart}
          start={start}
          setTimelineDescript={setTimelineDescript}
          handleEventSelection={handleEventSelection}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          iteration={iteration}
          setIteration={setIteration}
          handleForwardOrBackord={handleForwardOrBackord}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          eventId={eventId}
          setEventId={setEventId}
          value={value}
          setValue={setValue}
        />
        </>
      )}
      <div className="evenline-bars">
        {loading || !data ? (
          <CustomSkelton
            skeltonFor="tree"
            bodyCount={4}
            isButton={false}
            stylingClass=""
          />
        ) : data?.length > 0 ? (
          <>
            <RacingBarChart data={data} />
          </>
        ) : (
          // <h1>No Event Found!</h1>
          <Empty description="No Event Found!" />
        )}
      </div>
    </React.Fragment>
  );
}

export default TimeLine;
