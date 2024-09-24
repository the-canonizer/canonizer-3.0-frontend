import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { convert } from "html-to-text";

import { deleteNewsFeedApi } from "src/network/api/campNewsApi";
import { getNewsFeedApi } from "src/network/api/campDetailApi";
import { RootState } from "src/store";
import useAuthentication from "src/hooks/isUserAuthenticated";
import NewsItemListTab from "./newsItem";

const NewsFeedsCard = () => {
  const router = useRouter();

  const { isUserAuthenticated } = useAuthentication();

  const { is_admin, newsFeed } = useSelector((state: RootState) => ({
    is_admin: state?.auth?.loggedInUser?.is_admin,
    newsFeed: state?.topicDetails?.newsFeed,
  }));

  const [newsFeedList, setNewsFeedList] = useState(newsFeed || []);

  useEffect(() => {
    setNewsFeedList(newsFeed || []);
  }, [newsFeed]);

  const handleDeleteCamp = async (id) => {
    const res = await deleteNewsFeedApi({
      newsfeed_id: id,
    });

    if (res?.status_code == 200) {
      const reqBody = {
        topic_num: +router?.query?.camp?.at(0)?.split("-")?.at(0),
        camp_num: +(router?.query?.camp?.at(1)?.split("-")?.at(0) ?? 1),
      };
      await getNewsFeedApi(reqBody);
    }
  };

  const handleTextOverflow = (text) => {
    let str = convert(text?.replace(/<img[^>]*>/gi, ""), {
      wordwrap: 130,
    });
    return str?.length > 90 ? str?.substring(0, 90) + "..." : str;
  };

  return (
    <NewsItemListTab
      newsFeedList={newsFeedList}
      getTopicsLoadingIndicator={false}
      handleDeleteCamp={handleDeleteCamp}
      handleTextOverflow={handleTextOverflow}
      is_admin={is_admin}
      isUserAuthenticated={isUserAuthenticated}
      router={router}
    />
  );
};
export default NewsFeedsCard;
