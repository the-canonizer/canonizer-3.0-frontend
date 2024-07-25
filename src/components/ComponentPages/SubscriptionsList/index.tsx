import { useEffect, useState } from "react";
import { message } from "antd";

import SubscriptionsListUI from "./UI";
import CustomSkelton from "../../common/customSkelton";

import {
  GetAllSubscriptionsList,
  unsubscribeTopicOrCampAPI,
} from "src/network/api/userApi";

function SubscriptionsList({ isTestData = [] }: any) {
  const [subscriptionsList, setSubscriptionsList] = useState(isTestData);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});
  const [page] = useState(1);
  const [perPage] = useState("");
  const [isCamp, setIsCamp] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [camp, setCamp] = useState({});

  const getSubscriptionsList = async (q: string) => {
    const res = await GetAllSubscriptionsList(q);

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

  const campOrTopicUnsubscribe = async (body: Object) => {
    setIsLoading(true);
    const res = await unsubscribeTopicOrCampAPI(body);

    const query = `?page=${page}&per_page=${perPage}`;

    if (res && res["status_code"] === 200) {
      message.success(res?.data?.msg);
      setIsVisible(false);
      await getSubscriptionsList(query);
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

  const onRemove = async (e) => {
    e?.preventDefault();
    setIsDisabled(true);
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
      await campOrTopicUnsubscribe(body);
    }

    setTimeout(() => {
      setIsDisabled(false);
      setIsLoading(false);
    }, 900);
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
      isVisible={isVisible}
      onCancel={onCancel}
      onRemove={onRemove}
      topicTitle={currentTopic["title"]}
      topicLink={currentTopic["title_link"]}
      isCamp={isCamp}
      campTitle={camp["camp_name"]}
      campLink={camp["camp_link"]}
      isDisabled={isDisabled}
    />
  );
}

export default SubscriptionsList;
