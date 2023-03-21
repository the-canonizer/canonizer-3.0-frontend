import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { checkTopicCampExistAPICall } from "src/network/api/campDetailApi";

const TopicDetailsASPPage = () => {
  const router = useRouter();

  useEffect(() => {
    const aspath = router.asPath;
    if (aspath?.includes(".asp")) {
      const replaced = aspath.replace(".asp", "");
      router.replace(replaced);
    }
  }, []);

  return null;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const topic_num = +ctx.params?.camp[0]?.split("-")[0],
    camp_num = +(ctx.params?.camp[1]?.split("-")[0] ?? 1),
    url = ctx?.resolvedUrl;

  const reqBody = { topic_num, camp_num, url };
  const checkRes = await checkTopicCampExistAPICall(reqBody);

  if (checkRes && checkRes?.status_code === 200 && !checkRes?.data?.is_exist) {
    return {
      notFound: true,
    };
  }

  return { props: {} };
};

TopicDetailsASPPage.displayName = "TopicDetailsASPPage";

export default TopicDetailsASPPage;
