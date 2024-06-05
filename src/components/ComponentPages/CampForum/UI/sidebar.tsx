import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import HomeSideBar from "src/components/ComponentPages/Home-old/SideBar";
import { RootState } from "src/store";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { getTreesApi } from "src/network/api/campDetailApi";

const ThreadSidebar = () => {
  const myRefToCampStatement = useRef(null),
    showTreeSkeltonRef = useRef(false);

  const router = useRouter();

  const {
    asof,
    asofdate,
    algorithm,
    topicRecord,
    campRecord,
    viewThisVersionCheck,
  } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
    campRecord: state?.topicDetails?.currentCampRecord,
    asofdate: state.filters?.filterObject?.asofdate,
    algorithm: state.filters?.filterObject?.algorithm,
    asof: state?.filters?.filterObject?.asof,
    viewThisVersionCheck: state?.filters?.viewThisVersionCheck,
  }));

  const [getTreeLoadingIndicator, setGetTreeLoadingIndicator] = useState(false);

  const scrollToCampStatement = () => {
    myRefToCampStatement.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onCreateCamp = () => {
    const topicName = topicRecord?.topic_name?.replaceAll(" ", "-");
    const campName = campRecord?.camp_name?.replaceAll(" ", "-");

    router?.push({
      pathname: `/camp/create/${
        topicRecord?.topic_num
      }-${replaceSpecialCharacters(topicName, "-")}/${
        campRecord?.camp_num
      }-${replaceSpecialCharacters(campName, "-")}`,
    });
  };

  useEffect(() => {
    async function getTreeApiCall() {
      if (!showTreeSkeltonRef) {
        setGetTreeLoadingIndicator(true);
        showTreeSkeltonRef.current = true;
      }

      if (router?.asPath?.includes("/forum/")) {
        const reqBodyForService = {
          topic_num: (router?.query?.topic as string)?.split("-")[0],
          camp_num: (router?.query?.camp as string)?.split("-")[0] ?? 1,
          asOf: asof,
          asofdate:
            asof == "default" || asof == "review"
              ? Date.now() / 1000
              : asofdate,
          algorithm: algorithm,
          update_all: 1,
          fetch_topic_history: viewThisVersionCheck ? 1 : null,
        };

        await getTreesApi(reqBodyForService);

        setGetTreeLoadingIndicator(false);
      }
    }

    if (router?.asPath?.includes("/forum/")) {
      getTreeApiCall();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asofdate, algorithm, +(router?.query?.camp?.[1]?.split("-")[0] ?? 1)]);

  return (
    <Fragment>
      <aside className="leftSideBar miniSideBar topicPageNewLayoutSidebar bg-white">
        {router?.asPath?.includes("/forum/") ? (
          <HomeSideBar
            onCreateCamp={onCreateCamp}
            getTreeLoadingIndicator={getTreeLoadingIndicator}
            scrollToCampStatement={scrollToCampStatement}
            setTotalCampScoreForSupportTree={() => {}}
            setSupportTreeForCamp={() => {}}
            backGroundColorClass={"default"}
            isForumPage={true}
          />
        ) : (
          ""
        )}
      </aside>
    </Fragment>
  );
};
export default ThreadSidebar;
