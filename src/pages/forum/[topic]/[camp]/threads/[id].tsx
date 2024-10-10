import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { getThreadData } from "src/network/api/campForumApi";
import CampForumComponent from "components/ComponentPages/CampForum/PostPage";
import DataNotFound from "src/components/ComponentPages/DataNotFound/dataNotFound";
import { setThread } from "src/store/slices/campForumSlice";
import { createToken } from "src/network/api/userApi";

function CampForumPostPage({ threadData, notFoundStatus, notFoundMessage }) {
  const dispatch = useDispatch(),
    router = useRouter();

  dispatch(setThread(threadData));

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
export async function getServerSideProps({ req, resolvedUrl }) {
  const id = resolvedUrl?.split("/")[5];
  const topicNum = +resolvedUrl?.split("/")[2].split("-")[0];
  const campNum = +(resolvedUrl?.split("/")[3].split("-")[0] ?? 1);

  let token = null;

  if (req.cookies["loginToken"]) {
    token = req.cookies["loginToken"];
  } else {
    const response = await createToken();
    token = response?.access_token;
  }

  const threadRes = await getThreadData(
    id,
    String(topicNum),
    String(campNum),
    token
  );

  if (threadRes?.data?.status_code === 404) {
    return {
      props: {
        threadData: {},
        notFoundStatus: true,
        notFoundMessage: threadRes?.data?.error,
      },
    };
  }

  return {
    props: {
      threadData: threadRes?.data || {},
      notFoundStatus: false,
      notFoundMessage: "",
    },
  };
}

CampForumPostPage.displayName = "CampForumPage";

export default CampForumPostPage;
