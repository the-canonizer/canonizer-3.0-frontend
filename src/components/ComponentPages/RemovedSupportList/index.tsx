import { useEffect, useState } from "react";
import { message, Typography } from "antd";

import SubscriptionsListUI from "./UI";
import CustomSkelton from "../../common/customSkelton";

import {
  GetAllSubscriptionsList,
  unsubscribeTopicOrCampAPI,
} from "../../../network/api/userApi";
import {
  getAllUsedNickNames,
  getAllRemovedReasons,
} from "src/network/api/campDetailApi";

const { Text } = Typography;

function RemovedSupportList({ isTestData = [] }) {
  const [subscriptionsList, setSubscriptionsList] = useState(isTestData);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [page] = useState(1);
  const [perPage] = useState("");
  const [isCamp, setIsCamp] = useState(false);
  const [camp, setCamp] = useState({});
  const [nickNames, setNickNames] = useState([]);
  const [selectedNikname, setSelectedNikname] = useState(null);

  const getSubscriptionsList = async (q: string) => {
    const res = await GetAllSubscriptionsList(q);

    await getAllRemovedReasons();

    if (res?.status_code === 200) {
      setSubscriptionsList(res?.data.items);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const query = `?page=${page}&per_page=${perPage}`;
    getSubscriptionsList(query);
  }, [page, perPage]);

  const getNickNames = async () => {
    const body = { topic_num: 0 };

    let res = await getAllUsedNickNames(body);
    if (res && res.status_code == 200) {
      let nicks = res?.data?.map((n) => ({ ...n, label: n.nick_name }));
      setNickNames(nicks);
    }
  };

  useEffect(() => {
    getNickNames();
  }, []);

  const campOrTopicUnsubscribe = async (body: Object) => {
    setIsLoading(true);
    const res = await unsubscribeTopicOrCampAPI(body);

    const query = `?page=${page}&per_page=${perPage}`;

    if (res && res["status_code"] === 200) {
      message.success(res?.data?.msg);
      setIsVisible(false);
      getSubscriptionsList(query);
    }
    setIsLoading(false);
  };

  const onRemoveSubscription = (e: any, topic: object) => {
    e.preventDefault();
    setIsLoading(true);
    setIsVisible(true);
    setCurrentTopic(topic);
    setIsCamp(false);
    setIsLoading(false);
  };

  const onConfirm = (e: any, topic: any, camp: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsVisible(true);
    setIsCamp(true);
    setCurrentTopic(topic);
    setCamp(camp);
    setIsLoading(false);
  };

  const onCancel = () => {
    setIsVisible(false);
    setCurrentTopic({});
    setCamp({});
  };

  const onRemove = () => {
    setIsLoading(true);
    let body = null;
    if (isCamp) {
      body = {
        topic_num: currentTopic["topic_num"],
        camp_num: camp["camp_num"],
        checked: false,
        subscription_id: camp["subscription_id"],
      };
    } else {
      body = {
        topic_num: currentTopic["topic_num"],
        camp_num: 0,
        checked: false,
        subscription_id: currentTopic["subscription_id"],
      };
    }
    if (body) {
      campOrTopicUnsubscribe(body);
    }
    setIsLoading(false);
  };

  const onNickNameChange = (id, option) => {
    console.log("ksakdjshk", id, option);
    setSelectedNikname(id);
  };

  return isLoading ? (
    <CustomSkelton
      skeltonFor="subscription_card"
      bodyCount={4}
      stylingClass=""
      listStyle="liHeight"
      isButton={false}
    />
  ) : (
    <SubscriptionsListUI
      onRemoveSubscription={onRemoveSubscription}
      onConfirm={onConfirm}
      subscriptionsList={subscriptionsList}
      nickNameList={nickNames}
      selectedNikname={selectedNikname}
      onNickNameChange={onNickNameChange}
    />
  );
}

export default RemovedSupportList;
