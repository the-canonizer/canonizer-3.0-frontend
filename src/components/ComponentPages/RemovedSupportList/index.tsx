import { useEffect, useState } from "react";

import SubscriptionsListUI from "./UI";
import CustomSkelton from "components/common/customSkelton";
import { GetAllSubscriptionsList } from "src/network/api/userApi";
import {
  getAllUsedNickNames,
  getAllRemovedReasons,
} from "src/network/api/campDetailApi";

function RemovedSupportList({ isTestData = [] }: any) {
  const [subscriptionsList, setSubscriptionsList] = useState(isTestData);
  const [isLoading, setIsLoading] = useState(false);
  const [page] = useState(1);
  const [perPage] = useState("");
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
      let nicks = res?.data?.map((n: { nick_name: any }) => ({
        ...n,
        label: n.nick_name,
      }));
      setNickNames(nicks);
    }
  };

  useEffect(() => {
    getNickNames();
  }, []);

  const onConfirm = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setIsLoading(false);
  };

  const onNickNameChange = (id) => {
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
      onConfirm={onConfirm}
      subscriptionsList={subscriptionsList}
      nickNameList={nickNames}
      selectedNikname={selectedNikname}
      onNickNameChange={onNickNameChange}
    />
  );
}

export default RemovedSupportList;
