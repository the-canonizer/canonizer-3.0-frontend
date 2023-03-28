import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";
import My404 from "src/components/ComponentPages/404";
import { checkTopicCampExistAPICall } from "src/network/api/campDetailApi";
import { isServer } from "src/utils/generalUtility";

const My404Page = () => {
  const router = useRouter();

  /**
   *
   * [OLD Routes]
   * /topic.asp/120/8
   * /support_list.asp?nick_name_id=1
   * /thread.asp/23/13/4
   * /forum.asp/88/1
   * /topoc.asp/85
   * /manage.asp/2/2?class=camp
   * /statement.asp/2/2
   * /stmt.asp/2/2
   * /[anything].asp/dadsa
   *
   */

  const redirect = async (
    url: string,
    topic_num: number,
    camp_num: number,
    is_type: string,
    nick_id: any = "",
    thread_id: any = ""
  ) => {
    const reqBody = { topic_num, camp_num, url, nick_id, thread_id, is_type };
    const checkRes = await checkTopicCampExistAPICall(reqBody);

    if (checkRes && checkRes?.status_code === 200 && checkRes?.data?.is_exist) {
      router.replace(url);
    }
  };

  useEffect(() => {
    const aspath = router.asPath;
    if (aspath?.includes(".asp")) {
      if (aspath?.includes("topic.asp") || aspath?.includes("topoc.asp")) {
        const replaced = aspath.replace(".asp", "");
        let spilitedPath = replaced?.split("/");
        if (spilitedPath?.length > 3) {
          const topic = +spilitedPath[spilitedPath?.length - 2],
            camp = +spilitedPath[spilitedPath?.length - 1];
          redirect(`/topic/${topic}/${camp}`, topic, camp, "topic");
        } else {
          const topic = +spilitedPath[spilitedPath?.length - 1],
            camp = 1;
          redirect(`/topic/${topic}/${camp}`, topic, camp, "topic");
        }
      } else if (aspath?.includes("support_list.asp")) {
        if (!isServer()) {
          const params = new URLSearchParams(window.location.search),
            nickname = params.get("nick_name_id"),
            namespace = params.get("nick_name_id") || 1;

          if (nickname) {
            redirect(
              "/user/supports/" +
                nickname +
                "?topicnum=&campnum=&namespace=" +
                namespace,
              null,
              null,
              "nickname",
              +nickname
            );
          }
        }
      } else if (
        aspath?.includes("thread.asp") ||
        aspath?.includes("forum.asp")
      ) {
        const replaced = aspath.replace(".asp", "");
        let spilitedPath = replaced?.split("/");

        if (spilitedPath?.length > 4) {
          const topic = +spilitedPath[spilitedPath?.length - 3],
            camp = +spilitedPath[spilitedPath?.length - 2],
            thread_id = +spilitedPath[spilitedPath?.length - 1];
          redirect(
            `/forum/${topic}/${camp}/threads/${thread_id}`,
            topic,
            camp,
            "thread",
            null,
            thread_id
          );
        } else {
          const topic = +spilitedPath[spilitedPath?.length - 2],
            camp = +spilitedPath[spilitedPath?.length - 1];
          redirect(`/forum/${topic}/${camp}/threads`, topic, camp, "topic");
        }
      } else if (
        aspath?.includes("statement.asp") ||
        aspath?.includes("smt.asp") ||
        aspath?.includes("stmt.asp")
      ) {
        const replaced = aspath.replace(".asp", "");
        let spilitedPath = replaced?.split("/");
        const topic = +spilitedPath[spilitedPath?.length - 2],
          camp = +spilitedPath[spilitedPath?.length - 1];
        redirect(`/statement/history/${topic}/${camp}`, topic, camp, "topic");
      } else if (aspath?.includes("manage.asp")) {
        if (!isServer()) {
          const replaced = aspath.replace(".asp", "");
          let spilitedPath = replaced?.split("?")[0]?.split("/");
          const params = new URLSearchParams(window.location.search),
            classType = params.get("class"),
            topic = +spilitedPath[spilitedPath?.length - 2],
            camp = +spilitedPath[spilitedPath?.length - 1];
          if (classType == "camp") {
            redirect(`/camp/history/${topic}/${camp}`, topic, camp, "topic");
          } else if (classType == "topic") {
            redirect(`/topic/history/${topic}/${camp}`, topic, camp, "topic");
          } else if (classType == "statement") {
            redirect(
              `/statement/history/${topic}/${camp}`,
              topic,
              camp,
              "statement"
            );
          }
        }
      } else {
        redirect(aspath, null, null, "");
      }
    } else if (aspath.includes(".xml")) {
      redirect(aspath, null, null, "");
    }
  }, []);

  return (
    <Layout>
      {" "}
      <My404 />
    </Layout>
  );
};

My404Page.displayName = "My404Page";

export default My404Page;
