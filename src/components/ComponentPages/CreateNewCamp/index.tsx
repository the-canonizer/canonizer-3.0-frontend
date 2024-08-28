import { Fragment, useState, useEffect, useCallback } from "react";
import { Col, Form, Row } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";

import type { CheckboxChangeEvent } from "antd/es/checkbox";

import {
  createCamp,
  getAllParentsCamp,
  getAllCampNickNames,
  getAllUsedNickNames,
} from "src/network/api/campDetailApi";
import { setCurrentTopic } from "src/store/slices/topicSlice";
import messages from "src/messages";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import isAuth from "src/hooks/isUserAuthenticated";
import { setShowDrawer } from "src/store/slices/filtersSlice";
import { RootState } from "src/store";
import DataNotFound from "../DataNotFound/dataNotFound";
import CustomSpinner from "components/shared/CustomSpinner";
import ExistingCampList from "./UI/existingCampList";
import CampInfoCard from "./UI/rightContent";
import CampInfoBar from "../TopicDetails/CampInfoBar";
import FormUI from "./UI/FormUI";
import { globalSearchCanonizer } from "src/network/api/userApi";
import queryParams from "src/utils/queryParams";
import SimilarCampPopup from "./UI/similarCampsPopup";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

const getSimilarity = (str1, str2) => {
  const length = Math.max(str1.length, str2.length);
  let commonChars = 0;

  str1.split("").forEach((char) => {
    if (str2.includes(char)) commonChars++;
  });

  return commonChars / length;
};

const findSimilarNames = (inputName, namesList) => {
  const threshold = 0.7; // adjust for desired sensitivity
  return namesList.filter(
    (name) => getSimilarity(inputName, name) >= threshold
  );
};

const CreateNewCamp = () => {
  const { filterByScore, filterObject, viewThisVersion } = useSelector(
    (state: RootState) => ({
      filterByScore: state.filters?.filterObject?.filterByScore,
      filterObject: state?.filters?.filterObject,
      viewThisVersion: state?.filters?.viewThisVersionCheck,
    })
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = isAuth();

  const [form] = Form.useForm();

  const values = Form.useWatch([], form);

  const [nickNameList, setNickNameList] = useState([]);
  const [initialValue, setInitialValues] = useState({});
  const [parentCamp, setParentCamps] = useState([]);
  const [campExist, setCampExist] = useState(true);
  const [campNickName, setCampNickName] = useState([]);
  const [params, setParams] = useState({});
  const [options, setOptions] = useState([...messages.preventCampLabel]);
  const [isLoading, setIsLoading] = useState(false);
  const [haveCampExist, setHaveCampExist] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [existingCamps, setExistingCamps] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSimPopOpen, setIsSimPopOpen] = useState(false);
  const [isTopicLoading, setIsopicLoading] = useState(false);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const getExistingList = async (val = values?.camp_name) => {
    setIsopicLoading(true);
    const topicName = val,
      queryParamObj: any = {
        type: "camp",
        size: 5,
        page: 1,
        term: topicName,
      };

    const res = await globalSearchCanonizer(queryParams(queryParamObj)),
      resData = res?.data;

    if (res?.status_code === 200) {
      if (resData?.data?.camp && resData?.data?.camp?.length > 0) {
        setExistingCamps(resData?.data?.camp);
        setHaveCampExist(true);
      }

      if (resData?.meta_data?.total > 5) {
        setIsShowMore(true);
      }
    }
    setIsopicLoading(false);
  };

  const getRouterParams = () => {
    const q = router?.query;

    const topicArr = (q?.camp[0] as string)?.split("-");
    const campArr = (q?.camp[1] as string)?.split("-");
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
      form.setFieldValue("nick_name", response.data[0]?.id);
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

  const isSimilarAvaiable = () => {
    const namesList = existingCamps?.map((cmp) =>
      cmp?.type_value?.toLowerCase()
    );

    const similarNames = findSimilarNames(
      values?.camp_name?.toLowerCase(),
      namesList
    );

    return !!similarNames?.length;
  };

  const onFinalSubmit = async () => {
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
      openNotificationWithIcon(res.message, "success");

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
            if (
              key === "camp_name" &&
              res.error[key][0] === "The camp name has already been taken."
            ) {
              form.validateFields(["camp_name"]);
              setIsDisabled(false);
              setIsError(true);
              setIsSimPopOpen(false);
              getExistingList();
            }
          });
        }
      }
    }

    setIsSimPopOpen(false);

    setIsLoading(false);
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    const isSimAvalable = isSimilarAvaiable();

    if (isSimAvalable) {
      setIsSimPopOpen(true);
    } else {
      await onFinalSubmit();
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

  // const onParentCampChange = () => {};

  const payload = {
    camp_num: (router?.query.camp[1] as string)?.split("-")[0] ?? "1",
    topic_num: (router?.query.camp[0] as string)?.split("-")[0],
  };

  // const debounceFn = useCallback(() => debounce(getExistingList, 900), []);

  // const onCampChange = (e) => {
  //   setHaveCampExist(false);
  //   const enteredValues = e?.target?.value;
  //   if (enteredValues && enteredValues?.length > 2) {
  //     setIsopicLoading(true);
  //     setHaveCampExist(true);
  //     debounceFn();
  //   } else {
  //     setHaveCampExist(false);
  //   }
  // };

  const onCampChange = useCallback(
    debounce((e) => {
      const enteredValues = e?.target?.value;
      if (enteredValues && enteredValues?.length > 2) {
        setIsopicLoading(true);
        setHaveCampExist(true);
        getExistingList(enteredValues);
      } else {
        setHaveCampExist(false);
      }
    }, 900),
    []
  );

  const onCampNameBlur = () => {
    setIsError(false);
  };

  const onContributeCLick = (item, e) => {
    e?.preventDefault();
    const bd = JSON.parse(item?.breadcrumb_data);
    router?.push({ pathname: "/" + bd[0][1]?.camp_link });
  };

  const onClosePopup = () => setIsSimPopOpen(false);

  const onFtContriClick = (e) => {
    e?.preventDefault();
    setIsLoading(true);
    onClosePopup();
    router?.push({ pathname: "/search/camp", query: { q: values?.camp_name } });
  };

  return (
    <CustomSpinner key="create-topic-spinner" spinning={isLoading}>
      <CampInfoBar payload={payload} />

      <Row gutter={20} className="mb-5">
        {campExist ? (
          <Fragment>
            <Col lg={12}>
              <FormUI
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
                isLoading={isLoading}
                isEdit={false}
                isDisabled={isDisabled}
                onCampChange={onCampChange}
                onCampNameBlur={onCampNameBlur}
                values={values}
              />
            </Col>
            <Col lg={12}>
              {haveCampExist ? (
                <ExistingCampList
                  campName={values?.camp_name}
                  data={existingCamps}
                  isShowMore={isShowMore}
                  isError={isError}
                  onContributeCLick={onContributeCLick}
                  isLoading={isTopicLoading}
                />
              ) : (
                <CampInfoCard />
              )}
            </Col>
          </Fragment>
        ) : (
          <Col lg={24}>
            <DataNotFound
              name={"Camp"}
              message={"Camp not found"}
              backURL={"/"}
              goBack={true}
            />
          </Col>
        )}
      </Row>
      <SimilarCampPopup
        campName={values?.camp_name}
        data={existingCamps}
        isOpen={isSimPopOpen}
        onContributeCLick={onContributeCLick}
        handleCancel={onClosePopup}
        loading={false}
        onFtContriClick={onFtContriClick}
        onCreateCamp={onFinalSubmit}
      />
    </CustomSpinner>
  );
};

export { findSimilarNames };

export default CreateNewCamp;
