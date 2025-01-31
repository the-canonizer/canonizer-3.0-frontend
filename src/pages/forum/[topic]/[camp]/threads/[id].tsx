import { useRouter } from "next/router";
import { useEffect } from "react";

import { getThreadData } from "src/network/api/campForumApi";
import CampForumComponent from "components/ComponentPages/CampForum/PostPage";
import DataNotFound from "src/components/ComponentPages/DataNotFound/dataNotFound";
import { createToken } from "src/network/api/userApi";
import { store } from "src/store";
import {
  setCurrentTopicRecord,
  setCurrentCampRecord,
} from "src/store/slices/campDetailSlice";

function CampForumPostPage({ notFoundStatus, notFoundMessage }) {
  const router = useRouter();

  useEffect(() => {
    return () => {
      store.dispatch(setCurrentTopicRecord(null));
      store.dispatch(setCurrentCampRecord(null));
    };
  }, []);

  return notFoundStatus ? (
    <DataNotFound
      name="Thread"
      message={notFoundMessage}
      backURL={`/forum/${router?.query?.topic}/${router?.query?.camp}/threads`}
    />
  ) : (
    <div className="w-full">
      <CampForumComponent />
    </div>
  );
}

export async function getServerSideProps({ req, resolvedUrl,res }) {
  const id = resolvedUrl?.split("/")[5];
  const topicNum = +resolvedUrl?.split("/")[2].split("-")[0];
  const campNum = +(resolvedUrl?.split("/")[3].split("-")[0] ?? 1);

  let token = null;
  token = await createToken(req, res,false);


  const threadRes = await getThreadData(
    id,
    String(topicNum),
    String(campNum),
    token
  );

  if (threadRes?.data?.status_code === 404) {
    return {
      props: {
        notFoundStatus: true,
        notFoundMessage: threadRes?.data?.error,
      },
    };
  }

  return {
    props: {
      notFoundStatus: false,
      notFoundMessage: "",
    },
  };
}

CampForumPostPage.displayName = "CampForumPage";

export default CampForumPostPage;
