import { useEffect, useState } from "react";
import { message } from "antd";

import SubscriptionsListUI from "./UI";

import {
  GetAllSubscriptionsList,
  unsubscribeTopicOrCampAPI,
} from "../../../network/api/userApi";

function SubscriptionsList({ isTestData = [] }) {
  const [subscriptionsList, setSubscriptionsList] = useState(isTestData);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [page] = useState(1);
  const [perPage] = useState("");
  const [isCamp, setIsCamp] = useState(false);
  const [camp, setCamp] = useState({});

  const getSubscriptionsList = async (q: string) => {
    const res = await GetAllSubscriptionsList(q);

    if (res?.status_code === 200) {
      setSubscriptionsList(res?.data.items);
    }
  };

  useEffect(() => {
    const query = `?page=${page}&per_page=${perPage}`;
    getSubscriptionsList(query);
  }, [page, perPage]);

  const campOrTopicUnsubscribe = async (body: Object) => {
    const res = await unsubscribeTopicOrCampAPI(body);

    const query = `?page=${page}&per_page=${perPage}`;

    if (res && res["status_code"] === 200) {
      message.success(res?.data?.msg);
      setIsVisible(false);
      getSubscriptionsList(query);
    }
  };

  const onRemoveSubscription = (e: any, topic: object) => {
    e.preventDefault();
    setIsVisible(true);
    setCurrentTopic(topic);
    setIsCamp(false);
  };

  const onConfirm = (e: any, topic: any, camp: any) => {
    e.preventDefault();
    setIsVisible(true);
    setIsCamp(true);
    setCurrentTopic(topic);
    setCamp(camp);
  };

  const onCancel = () => {
    setIsVisible(false);
    setCurrentTopic({});
    setCamp({});
  };

  const onRemove = () => {
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
  };

  return (
    <SubscriptionsListUI
      onRemoveSubscription={onRemoveSubscription}
      onConfirm={onConfirm}
      subscriptionsList={subscriptionsList}
      isVisible={isVisible}
      onCancel={onCancel}
      onRemove={onRemove}
      topicTitle={currentTopic["title"]}
      topicLink={currentTopic["title_link"]}
      isCamp={isCamp}
      campTitle={camp["camp_name"]}
      campLink={camp["camp_link"]}
    />
  );
}

export default SubscriptionsList;
