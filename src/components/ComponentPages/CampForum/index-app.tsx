import { Fragment, useState, useEffect } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "src/store";
import useIsUserAuthenticated from "src/hooks/isUserAuthenticated";
import ForumUIList from "./List";
import { getThreadsList } from "src/network/api/campForumApi";
import {
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "src/network/api/campDetailApi";
import CampInfoBar from "../TopicDetails/CampInfoBar/index-app";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import { setThread } from "src/store/slices/campForumSlice";

const ForumComponent = () => {
  const router = useRouter(),
    params = useParams(),
    searchParams = useSearchParams(),
    pathName = usePathname(),
    dispatch = useDispatch();

  const { isUserAuthenticated } = useIsUserAuthenticated();
  const { campRecord, asof, asofdate, algorithm }: any = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
    })
  );

  const [paramsList, setParamsList] = useState({});
  const [threadList, setThreadList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(params?.page ? +params?.page : 1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserAuthenticated);
  const [loading, setLoading] = useState(true);
  const [perPage] = useState(10);

  useEffect(() => setIsLoggedIn(isUserAuthenticated), [isUserAuthenticated]);

  const getSelectedNode = async (nodeKey: string | number | undefined) => {
    if (params && params.topic) {
      const topicArr = (params.topic as string).split("-");
      const topic_num = topicArr.shift();
      const reqBody = {
        topic_num: topic_num !== undefined ? +topic_num : 0,
        camp_num: nodeKey !== undefined ? +nodeKey : 0,
        as_of: asof,
        as_of_date: asofdate || Date.now() / 1000,
        algorithm: algorithm,
        update_all: 1,
      };

      await Promise.all([
        getCurrentTopicRecordApi(reqBody),
        getCurrentCampRecordApi(reqBody),
      ]);
    }
  };

  const setCurrentThread = (data: any) => dispatch(setThread(data));

  async function getThreads(
    camp: string | undefined,
    topic: string | undefined,
    type = "all",
    pp = 1,
    like = "",
    per_page = perPage
  ) {
    setLoading(true);

    try {
      let q = `?camp_num=${camp}&topic_num=${topic}&type=${type}&page=${pp}&per_page=${per_page}&like=${like}`;

      if (!isLoggedIn || type === "all") {
        q = `?camp_num=${camp}&topic_num=${topic}&type=all&page=${pp}&per_page=${per_page}&like=${like}`;
      }

      const res = await getThreadsList(q);

      if (res.status_code === 200) {
        setThreadList(res.data.items);
        setTotalRecords(res.data.total_rows);
      }
    } catch (error) {
      // Handle error or show appropriate feedback to the user
    } finally {
      setLoading(false);
    }
  }

  const onSearch = (v: string) => {
    setSearchQuery(v.trim());
  };

  const onChange = (p: any) => {
    setLoading(true);
    setPage(p);
    const sparams = new URLSearchParams();
    sparams.set("page", p);

    // router.push(router, { shallow: true });
  };

  const onCreateThread = () => {
    const topic = params?.topic as string;
    const camp = params?.camp as string;

    const topicSlug = replaceSpecialCharacters(topic, "-");
    const campSlug = replaceSpecialCharacters(camp, "-");

    const create_path = `/forum/${topicSlug}/${campSlug}/threads/create`;

    if (isLoggedIn) {
      router.push(create_path);
    } else {
      router.push(`/login?returnUrl=${create_path}`);
    }
  };

  const onThreadClick = (
    e: { preventDefault: () => void; stopPropagation: () => void },
    data: { id: any }
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const topic = params?.topic as string;
    const camp = params?.camp as string;
    const threadId = data.id;

    const topicSlug = replaceSpecialCharacters(topic, "-");
    const campSlug = replaceSpecialCharacters(camp, "-");

    const threadPath = `/camp-forum/${topicSlug}/${campSlug}/threads/${threadId}`;

    router.push(threadPath);
  };

  const filterThread = (type: string) => {
    setLoading(true);
    if (type !== searchParams?.get("by")) {
      setPage(1);

      const queryString = searchParams?.toString(),
        qParams = new URLSearchParams(queryString),
        qObj: any = {},
        returnP = new URLSearchParams();

      qParams.forEach((value, key) => {
        qObj[key] = value;
      });

      qObj.by = type;

      for (const [key, value] of Object.entries(qObj)) {
        returnP.append(key, value as string);
      }

      const queString = returnP.toString();

      router.push(`${pathName}?${queString}`);
    }
    setLoading(false);
  };

  const onEditClick = (
    e: { preventDefault: () => void; stopPropagation: () => void },
    item: { id: any }
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const topic = params?.topic as string;
    const camp = params?.camp as string;
    const threadId = item.id;

    const topicSlug = replaceSpecialCharacters(topic, "-");
    const campSlug = replaceSpecialCharacters(camp, "-");

    const editPath = `/forum/${topicSlug}/${campSlug}/threads/edit/${threadId}`;
    setCurrentThread(item);
    router.push(editPath);
  };

  // end thread list section

  // create thread start
  useEffect(() => {
    if (params) {
      const campArr = (params.camp as string).split("-");
      const camp_num = campArr.shift();
      getSelectedNode(camp_num);
    }
  }, [router]);

  useEffect(() => {
    let p_camps = "";

    const topicArr = (params?.topic as string)?.split("-");
    const campArr = (params?.camp as string)?.split("-");
    const topic_num = topicArr?.shift();
    const camp_num = campArr?.shift();
    const topic = topicArr?.join(" ");
    const camp = campArr?.join(" ");

    if (campRecord && campRecord?.parentCamps) {
      campRecord?.parentCamps?.map(
        (camp: { camp_name: any }, index: number) => {
          p_camps += index !== 0 ? " / " : "";
          p_camps += `${camp?.camp_name}`;
        }
      );
    }

    const paramsLists = {
      topic,
      camp: p_camps,
      camp_num,
      topic_num,
      by: searchParams?.get("by"),
      camp_name: camp,
    };

    setParamsList(paramsLists);
  }, [campRecord, searchParams, router]);

  useEffect(() => {
    setLoading(true);
    const campArr = (params?.camp as string).split("-");
    const camp_num = campArr.shift();
    const topicArr = (params?.topic as string)?.split("-");
    const topic_num = topicArr?.shift();
    const type = searchParams?.get("by") as string;

    let timer = 0;

    if (timer) {
      clearTimeout(timer);
      timer = 0;
    }

    timer = window.setTimeout(async () => {
      getThreads(camp_num, topic_num, type, page, searchQuery);
    }, 800);
  }, [router, searchParams, page, searchQuery, isLoggedIn]);

  //  post section end
  let payload = {
    camp_num: (params?.camp as string)?.split("-")[0] ?? "1",
    topic_num: (params?.topic as string)?.split("-")[0],
  };

  return (
    <Fragment>
      <CampInfoBar payload={payload} />
      <ForumUIList
        onSearch={onSearch}
        onChange={onChange}
        onCreateThread={onCreateThread}
        threadList={threadList}
        onThreadClick={onThreadClick}
        onEditClick={onEditClick}
        current={page}
        total={totalRecords}
        filterThread={filterThread}
        paramsList={paramsList}
        isLoading={loading}
      />
    </Fragment>
  );
};

export default ForumComponent;
