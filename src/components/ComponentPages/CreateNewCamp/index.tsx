import { Fragment, useState, useEffect } from "react";
import { Form, message } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
} from "../../../network/api/campDetailApi";
import { setCurrentTopic } from "../../../store/slices/topicSlice";
import messages from "../../../messages";

import CreateNewCampUI from "./UI/CampUI";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import isAuth from "../../../hooks/isUserAuthenticated";
import { setShowDrawer } from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import DataNotFound from "../DataNotFound/dataNotFound";

const CreateNewCamp = ({
  nickNames = [],
  parentCamps = [],
  campNickNames = [],
  initialValues = {},
}: any) => {
  const { filterByScore, filterObject, viewThisVersion } = useSelector(
    (state: RootState) => ({
      filterByScore: state.filters?.filterObject?.filterByScore,
      filterObject: state?.filters?.filterObject,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );

  const [nickNameList, setNickNameList] = useState(nickNames);
  const [initialValue, setInitialValues] = useState(initialValues);
  const [parentCamp, setParentCamps] = useState(parentCamps);
  const [campExist, setCampExist] = useState(true);
  const [campNickName, setCampNickName] = useState(campNickNames);
  const [params, setParams] = useState({});
  const [options, setOptions] = useState([...messages.preventCampLabel]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = isAuth();

  const getRouterParams = () => {
    const q = router?.query;

    const topicArr = (q?.camp[0] as string).split("-");
    const campArr = (q?.camp[1] as string).split("-");
    const topic_num = topicArr?.shift();
    const camp_num = campArr?.shift();
    const topic = topicArr?.join(" ");
    const camp = campArr?.join(" ");

    const pr = {
      topic_name: topic,
      topic_num: +topic_num,
      camp_name: camp,
      camp_num: +camp_num,
    };

    return pr;
  };

  useEffect(() => {
    const q = getRouterParams();

    const p = {
      topic: q?.topic_name,
      camp_num: q?.camp_num,
      topic_num: q?.topic_num,
      topic_name: q?.topic_name,
      camp_name: q?.camp_name,
    };

    setParams(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query]);

  const fetchNickNameList = async () => {
    setIsLoading(true);
    const q = getRouterParams();
    const body = { topic_num: q?.topic_num };
    let response = await getAllUsedNickNames(body);
    if (response && response.status_code === 200) {
      setNickNameList(response.data);
      setInitialValues({ nick_name: response.data[0]?.id });
      setIsLoading(false);
      return response.status_code;
    } else {
      setIsLoading(false);
      return response.status ?? "";
    }
  };

  const fetchCampNickNameList = async () => {
    setIsLoading(true);
    let response = await getAllCampNickNames();
    if (response && response.status_code === 200) {
      setCampNickName(response.data);
    }
    setIsLoading(false);
  };

  const fetchParentsCampList = async () => {
    setIsLoading(true);
    const q = getRouterParams();
    const body = { topic_num: q?.topic_num, parent_camp_num: q.camp_num };
    let res = await getAllParentsCamp(body);
    if (res && res.status_code === 200) {
      setParentCamps(res.data);
      if (res?.data?.length > 0) {
        setCampExist(
          res?.data?.some((parent) => parent?.camp_num == q?.camp_num)
        );
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchCampNickNameList();
      fetchParentsCampList();
      fetchNickNameList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    setIsLoading(true);
    if (!values.camp_name?.trim()) {
      form.setFields([
        {
          name: "camp_name",
          value: "",
        },
      ]);
      form.validateFields(["camp_name"]);
      setIsLoading(false);
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

    options.map((op) => (body[op.id] = op.checked ? 1 : 0));

    const res = await createCamp(body);
    if (res && res.status_code === 200) {
      message.success(res.message);

      dispatch(
        setCurrentTopic({ message: res.message, camp_num: res.data.camp_num })
      );

      const { camp } = router?.query;
      const returnPath = localStorage.getItem("topicPath"),
        defPath = `/topic/${replaceSpecialCharacters(camp[0], "-")}/${
          res?.data?.camp_num
        }-${replaceSpecialCharacters(
          values.camp_name,
          "-"
        )}?score=${filterByScore}&algo=${filterObject?.algorithm}${
          filterObject?.asof == "bydate"
            ? "&asofdate=" + filterObject?.asofdate
            : ""
        }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${
          viewThisVersion ? "&viewversion=1" : ""
        }`;

      let pathToPush = defPath;

      if (returnPath === "/forum/[topic]/[camp]/threads/[id]") {
        pathToPush = `/forum/${camp[0]}/${
          res?.data?.camp_num
        }-${replaceSpecialCharacters(values.camp_name, "-")}/threads`;
      } else if (returnPath === "/forum/[topic]/[camp]/threads") {
        pathToPush = `/forum/${camp[0]}/${
          res?.data?.camp_num
        }-${replaceSpecialCharacters(values.camp_name, "-")}/threads`;
      } else if (returnPath === "/forum/[topic]/[camp]/threads/create") {
        pathToPush = `/forum/${camp[0]}/${
          res?.data?.camp_num
        }-${replaceSpecialCharacters(values.camp_name, "-")}/threads/create`;
      }

      router?.push(pathToPush);

      const oldOptions = [...options];
      await oldOptions.map((op) => {
        op.checked = false;
        op.disable = false;
      });
      setOptions(oldOptions);
      dispatch(setShowDrawer(true));
      localStorage.removeItem("topicPath");
      return;
    }

    if (res && res.status_code === 400) {
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key?.length) {
          errors_key.forEach((key) => {
            form.setFields([
              {
                name: key,
                value: values[key],
                errors: [res.error[key]],
              },
            ]);
          });
        }
      }
    }

    setIsLoading(false);
  };

  const onCancel = () => {
    const { camp } = router?.query;
    const returnPath = localStorage.getItem("topicPath"),
      defPath = `/topic/${replaceSpecialCharacters(
        camp[0],
        "-"
      )}/${replaceSpecialCharacters(
        camp[1],
        "-"
      )}?score=${filterByScore}&algo=${filterObject?.algorithm}${
        filterObject?.asof == "bydate"
          ? "&asofdate=" + filterObject?.asofdate
          : ""
      }&asof=${filterObject?.asof}&canon=${filterObject?.namespace_id}${
        viewThisVersion ? "&viewversion=1" : ""
      }`;

    let pathToPush = defPath;

    if (returnPath === "/forum/[topic]/[camp]/threads/[id]") {
      pathToPush = `/forum/${camp[0]}/${camp[1]}/threads`;
    } else if (returnPath === "/forum/[topic]/[camp]/threads") {
      pathToPush = `/forum/${camp[0]}/${camp[1]}/threads`;
    } else if (returnPath === "/forum/[topic]/[camp]/threads/create") {
      pathToPush = `/forum/${camp[0]}/${camp[1]}/threads/create`;
    }

    router?.push(pathToPush);
    localStorage.removeItem("topicPath");
  };

  // checkbox
  useEffect(() => {
    return () => {
      const oldOptions = [...options];
      oldOptions.map((op) => {
        op.checked = false;
      });

      setOptions(oldOptions);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCheckboxChange = async (e: CheckboxChangeEvent) => {
    const oldOptions = [...options];

    await oldOptions.map((op) => {
      if (op.id === e.target.value) {
        op.checked = e.target.checked;
      } else {
        op.checked = false;
      }
    });

    setOptions(oldOptions);
  };

  const onParentCampChange = () => {};

  return (
    <Fragment>
      {campExist ? (
        <CreateNewCampUI
          onFinish={onFinish}
          onCancel={onCancel}
          form={form}
          initialValue={initialValue}
          topicData={params}
          nickNameList={nickNameList}
          parentCamp={parentCamp}
          campNickName={campNickName}
          options={options}
          onCheckboxChange={onCheckboxChange}
          onParentCampChange={onParentCampChange}
          isLoading={isLoading}
        />
      ) : (
        <DataNotFound
          name={"Camp"}
          message={"Camp not found"}
          backURL={"/"}
          goBack={true}
        />
      )}
    </Fragment>
  );
};

export default CreateNewCamp;
