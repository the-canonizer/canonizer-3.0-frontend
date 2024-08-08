import { useEffect } from "react";
import { useRouter } from "next/router";

import { getThreadsList } from "src/network/api/campForumApi";
import CampThreadComponent from "components/ComponentPages/CampForum";
import { createToken } from "src/network/api/userApi";

function CampForumListPage({ threadList }) {
  const router = useRouter();

  useEffect(() => {
    if (threadList?.status_code == 404) {
      router?.push(
        router?.asPath?.replace("forum", "topic")?.replace("/threads", "")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full">
      {threadList?.status_code != "404" && <CampThreadComponent />}
    </div>
  );
}
export async function getServerSideProps({ req, resolvedUrl }) {
  const topicNum = +resolvedUrl?.split("/")[2].split("-")[0];
  const campNum = +(resolvedUrl?.split("/")[3].split("-")[0] ?? 1);
  const q = `?camp_num=${campNum}&topic_num=${topicNum}&type=all&page=${1}&per_page=${10}&like=`;

  let token = null;
  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const [threadList] = await Promise.all([getThreadsList(q)]);

  return {
    props: {
      threadList: threadList || {},
    },
  };
}

CampForumListPage.displayName = "CampForumListPage";

export default CampForumListPage;
