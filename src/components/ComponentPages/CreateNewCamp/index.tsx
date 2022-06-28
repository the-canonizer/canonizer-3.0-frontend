import { Fragment, useState, useEffect } from "react";
import { Form, message } from "antd";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
  getCurrentCampRecordApi,
  getCurrentTopicRecordApi,
} from "../../../network/api/campDetailApi";
import { RootState } from "../../../store";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import isAuth from "../../../hooks/isUserAuthenticated";

import CreateNewCampUI from "./UI/CampUI";

const CreateNewCamp = ({
  nickNames = [],
  parentCamps = [],
  campNickNames = [],
  initialValues = {},
}) => {
  const [nickNameList, setNickNameList] = useState(nickNames);
  const [initialValue, setInitialValues] = useState(initialValues);
  const [parentCamp, setParentCamps] = useState(parentCamps);
  const [campNickName, setCampNickName] = useState(campNickNames);
  const [params, setParams] = useState({});

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const isLoggedIn = isAuth();

  const { topicRecord, campRecord, asof, asofdate, algorithm } = useSelector(
    (state: RootState) => ({
      topicRecord: state?.topicDetails?.currentTopicRecord,
      campRecord: state?.topicDetails?.currentCampRecord,
      asof: state?.filters?.filterObject?.asof,
      asofdate: state.filters?.filterObject?.asofdate,
      algorithm: state.filters?.filterObject?.algorithm,
    })
  );

  const getRouterParams = () => {
    const q = router.query;

    const topicArr = (q.camp[0] as string).split("-");
    const campArr = (q.camp[1] as string).split("-");
    const topic_num = topicArr.shift();
    const camp_num = campArr.shift();
    const topic = topicArr.join(" ");
    const camp = campArr.join(" ");

    const pr = {
      topic_name: topic,
      topic_num: +topic_num,
      camp_name: camp,
      camp_num: +camp_num,
    };

    return pr;
  };

  const getSelectedNode = async (nodeKey) => {
    const q = getRouterParams();

    const reqBody = {
      topic_num: q.topic_num,
      camp_num: +nodeKey,
      as_of: asof,
      asofdate: asofdate || Date.now() / 1000,
      algorithm: algorithm,
      update_all: 1,
    };

    await Promise.all([
      getCurrentTopicRecordApi(reqBody),
      getCurrentCampRecordApi(reqBody),
    ]);
  };

  useEffect(() => {
    if (router && router.query) {
      const q = getRouterParams();
      getSelectedNode(q.camp_num);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, router?.query]);

  useEffect(() => {
    const q = getRouterParams();
    let p_camps = "";

    if (campRecord && campRecord.parentCamps) {
      campRecord.parentCamps?.map((camp, index) => {
        p_camps += index !== 0 ? " / " : "";
        p_camps += `${camp?.camp_name}`;
      });
    }

    const p = {
      topic: q.topic_name,
      camp: p_camps,
      camp_num: q.camp_num,
      topic_num: q.topic_num,
      topic_name: q.topic_name,
      camp_name: p_camps,
    };

    setParams(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campRecord, router.query]);

  const fetchNickNameList = async () => {
    const q = getRouterParams();
    const body = { topic_num: q.topic_num };
    let response = await getAllUsedNickNames(body);
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
      return response.status_code;
    } else {
      return response.status ?? "";
    }
  };

  const fetchCampNickNameList = async () => {
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
  };

  const fetchParentsCampList = async () => {
    const q = getRouterParams();
    const body = { topic_num: q.topic_num };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
    }
  };

  useEffect(() => {
    fetchCampNickNameList();
    fetchParentsCampList();
    fetchNickNameList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values: any) => {
    if (!values.camp_name?.trim()) {
      form.setFields([
        {
          name: "camp_name",
          value: "",
        },
      ]);
      form.validateFields(["camp_name"]);
      return true;
    }
    const body = {
      camp_about_nick_id: values.camp_about_nick_id || "",
      camp_about_url: values.camp_about_url || "",
      camp_name: values.camp_name?.trim(),
      key_words: values.key_words || "",
      note: values.note?.trim() || "",
      parent_camp_num: values.parent_camp_num,
      nick_name: values.nick_name,
      topic_num: params["topic_num"],
    };

    const res = await createCamp(body);
    if (res && res.status_code === 200) {
      message.success(res.message);

      dispatch(
        setCurrentTopic({ message: res.message, camp_num: res.data.camp_num })
      );

      const { camp } = router.query;

      router.push({
        pathname: `/topic/${camp[0]}/${res?.data?.camp_num}-${values.camp_name
          ?.split(" ")
          .join("-")}`,
      });
    }

    if (res && res.status_code === 400 && res.error?.camp_name) {
      form.setFields([
        {
          name: "camp_name",
          value: values.camp_name,
          errors: [res.error.camp_name],
        },
      ]);
    }
  };

  const onCancel = () => {
    const { camp } = router.query;
    router.push(`/topic/${camp[0]}/${camp[1]}`);
  };

  return (
    <Fragment>
      <CreateNewCampUI
        onFinish={onFinish}
        onCancel={onCancel}
        form={form}
        initialValue={initialValue}
        topicData={params}
        nickNameList={nickNameList}
        parentCamp={parentCamp}
        campNickName={campNickName}
        topicRecord={topicRecord}
        campRecord={campRecord}
      />
    </Fragment>
  );
};

export default CreateNewCamp;
