import { useEffect, useState } from "react";

import SubscriptionsListUI from "./UI";

import { GetAllSubscriptionsList } from "../../../network/api/userApi";

const subsList = [
  {
    topic_num: 323,
    title: "topic one 17 05",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [],
  },
  {
    topic_num: 324,
    title: "topic two",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [
      {
        camp_num: 4,
        camp_name: "Agreement",
        support_order: 1,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
      {
        camp_num: 5,
        camp_name: "Agreement-2",
        support_order: 2,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
    ],
  },
];

function SubscriptionsList({ isTestData = [...subsList] }) {
  const [activeKey, setActiveKey] = useState("topic_subs");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscriptionsList, setSubscriptionsList] = useState(isTestData);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTopic, setCurrentTopic] = useState({});

  const getSubscriptionsList = async (q: string) => {
    const res = await GetAllSubscriptionsList(q);
    console.log("response", res);

    if (res?.status_code === 200) {
      setSubscriptionsList(res?.data);
    }
  };

  useEffect(() => {
    getSubscriptionsList("");
  }, []);

  // const tabCallBack = (key: string) => {
  //   setActiveKey(key);
  // };

  // const onSearch = (ev: any) => setSearchQuery(ev.target.value);

  const onRemoveSubscription = (e: any, topic: object) => {
    e.preventDefault();
    setIsVisible(true);
    setCurrentTopic(topic);
  };

  const onConfirm = (e: any) => {
    e.preventDefault();
    console.log("onConfirm", e);
  };

  const onCancel = () => {
    setIsVisible(false);
  };

  const onRemove = () => {};

  return (
    <SubscriptionsListUI
      activeKey={activeKey}
      onRemoveSubscription={onRemoveSubscription}
      onConfirm={onConfirm}
      subscriptionsList={subscriptionsList}
      isVisible={isVisible}
      onCancel={onCancel}
      onRemove={onRemove}
      topicTitle={currentTopic["title"]}
    />
  );
}

export default SubscriptionsList;
