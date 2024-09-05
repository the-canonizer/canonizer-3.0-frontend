import { useState, useEffect, useCallback } from "react";
import { Col, Form, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import { HomeOutlined } from "@ant-design/icons";

import { globalSearchCanonizer } from "src/network/api/userApi";
import { RootState } from "src/store";
import isAuth from "src/hooks/isUserAuthenticated";
import {
  setFilterCanonizedTopics,
  setShowDrawer,
} from "src/store/slices/filtersSlice";
import { replaceSpecialCharacters } from "src/utils/generalUtility";
import CustomSpinner from "components/shared/CustomSpinner";
import FromUI from "./UI/FromUI";
import TopicInfoCard from "./UI/rightContent";
import ExistingTopicList from "./UI/existingTopicList";
import queryParams from "src/utils/queryParams";
import { getAllUsedNickNames } from "src/network/api/campDetailApi";
import {
  getEditTopicApi,
  updateTopicApi,
} from "src/network/api/campManageStatementApi";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";
import Breadcrumbs from "components/shared/Breadcrumbs";

const UpdateTopic = () => {
  const router = useRouter();
  const historyOf = router?.asPath.split("/")?.at(2);
  const objection =
    router?.query?.["statement"]?.at(0)?.split("-")?.at(1) == "objection";

  const { nameSpaces, catTaga, namespace_id } = useSelector((state: RootState) => ({
    nameSpaces: state.homePage.nameSpaces,
    catTaga: state?.tag?.tags,
    namespace_id: state.filters?.filterObject?.namespace_id,
  }));

  const [nickNameList, setNickNameList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTopicLoading, setIsopicLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedCats, setSelectedCats] = useState([]);
  const [existingTopics, setExistingTopics] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  const [haveTopicExist, setHaveTopicExist] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [currentTopicNickNames, setCurrentTopicNckNames] = useState(null);
  const [isSubmitReq, setIsSubmitReq] = useState(false);
  const [editCampStatementData, setEditCampStatementData] = useState("");

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { isUserAuthenticated } = isAuth();

  const update = router?.query?.statement?.at(0)?.split("-")[1] == "update";

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const compareTags = (existedData, newData) => {
    const newIds = newData?.map((item) => item?.id);
    const areSame =
      existedData?.every((id) => newIds?.includes(id)) &&
      newIds?.every((id) => existedData?.includes(id));

    return areSame;
  };

  useEffect(() => {
    if (
      currentTopic?.topic_name?.trim() !== values?.topic_name?.trim() ||
      currentTopicNickNames?.at(0)?.id !== values?.nick_name ||
      currentTopic?.namespace_id !== values?.namespace ||
      currentTopic?.edit_summary !== values?.edit_summary ||
      !compareTags(currentTopic?.tags, selectedCats)
    ) {
      setIsSubmitReq(true);
    } else {
      setIsSubmitReq(false);
    }
  }, [values, currentTopic, selectedCats]);

  useEffect(() => {
    if (currentTopic?.tags?.length) {
      const existedCats = catTaga?.filter((ct) =>
        currentTopic?.tags?.includes(ct?.id)
      );

      setSelectedCats(existedCats);
    }
  }, [currentTopic?.tags]);

  useEffect(() => {
    const getTopicDetails = async () => {
      setIsLoading(true);
      const topicPayload = {
        record_id: router?.query?.statement?.at(0)?.split("-")[0],
        event_type: "edit",
      };

      const res = await getEditTopicApi(topicPayload);

      if (res?.status_code == 200) {
        const topicData = res?.data?.topic;

        setCurrentTopicNckNames(res?.data?.nick_name);

        setCurrentTopic(topicData);

        setEditCampStatementData(topicData?.note);

        const result = await getAllUsedNickNames({
          topic_num: topicData?.topic_num,
        });

        if (result?.status_code == 200) {
          const resData = result.data;

          await form.setFieldValue("nick_name", resData[0]?.id);
          await form.setFieldValue("topic_name", topicData?.topic_name);
          await form.setFieldValue("namespace", topicData?.namespace_id);
          await form.setFieldValue("edit_summary", topicData?.edit_summary);

          setNickNameList(resData);
        }
      }
      setIsLoading(false);
    };

    if (isUserAuthenticated) {
      setIsLoading(true);
      getTopicDetails();
    } else {
      router?.push({
        pathname: "/login",
        query: { returnUrl: router?.asPath },
      });
    }
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    const body = {
      topic_name: values.topic_name?.trim(),
      namespace: values.namespace,
      nick_name: values.nick_name,
      topic_num: currentTopic?.topic_num,
      topic_id: currentTopic?.id,
      namespace_id: values.namespace? values.namespace: namespace_id,
      submitter: currentTopic?.submitter_nick_id,
      tags: selectedCats?.map((cat) => cat?.id),
      event_type: objection ? "objection" : update ? "edit" : "update",
      note: values?.edit_summary || null,
      objection_reason:  objection ? values?.objection_reason : null,
    };

    const res = await updateTopicApi(body);

    if (res && res.status_code === 400) {
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key.length) {
          if ("existed_topic_reference" in res.error) {
            form.setFields([
              {
                name: "topic_name",
                value: values?.topic_name,
                errors: res?.error?.topic_name,
              },
            ]);
            form.validateFields(["topic_name"]);
            setIsDisabled(false);
            setIsError(true);
            getExistingList();
          }

          errors_key.forEach((key) => {
            if (key !== "topic_name") {
              form.setFields([
                {
                  name: key,
                  value: values[key],
                  errors: [res.error[key]],
                },
              ]);
            }
          });
        }
      }
    }

    if (res && res.status_code === 200) {
      openNotificationWithIcon(res.message, "success");
      storeFilterClear();
      router?.push({
        pathname: `/topic/history/${
          currentTopic?.topic_num
        }-${replaceSpecialCharacters(currentTopic?.topic_name, "-")}`,
      });

      dispatch(setShowDrawer(true));
    }

    setIsLoading(false);
  };

  const storeFilterClear = () => {
    dispatch(setFilterCanonizedTopics({ filterByScore: "" }));
  };

  const onCancel = () => {
    router?.back();
  };

  const onTagSelect = (id) => {
    const currentitem = catTaga?.find((c) => c?.id == id);
    if (currentitem) {
      const isExist = selectedCats?.find((c) => c?.id == id);
      if (!isExist) {
        setSelectedCats((prev) => {
          const updatedCats = [...prev, currentitem];
          return updatedCats;
        });
      }
    }
  };

  const onCatRemove = (e, item) => {
    e?.preventDefault();
    const isExist = selectedCats?.find((c) => c?.id == item?.id);

    if (isExist) {
      setSelectedCats((prev) => {
        const updatedCats = prev?.filter((p) => p?.id != item?.id);
        return updatedCats;
      });
    }
  };

  const getExistingList = async (val = values?.topic_nam) => {
    setIsopicLoading(true);
    const topicName = val,
      queryParamObj: any = {
        type: "topic",
        size: 5,
        page: 1,
        term: topicName?.trim(),
      };

    const res = await globalSearchCanonizer(queryParams(queryParamObj)),
      resData = res?.data;

    if (res?.status_code === 200) {
      if (resData?.data?.topic) {
        if (resData?.data?.topic?.length) {
          setHaveTopicExist(true);
        } else {
          setHaveTopicExist(false);
        }
        setExistingTopics(resData?.data?.topic);
      }

      if (resData?.meta_data?.total > 5) {
        setIsShowMore(true);
      }
    }
    setIsopicLoading(false);
  };

  const isMatched = () => {
    const isMatched = existingTopics.some(
      (tp) =>
        values?.topic_name?.trim()?.toLowerCase() ===
        tp?.type_value?.trim()?.toLowerCase()
    );

    if (isMatched) {
      setIsError(true);
      return;
    }

    if (!isMatched) {
      setIsError(false);
    }
  };

  useEffect(() => {
    if (existingTopics?.length) {
      isMatched();
    }
  }, [existingTopics, values?.topic_name]);

  const onTopicChange = useCallback(
    debounce((e) => {
      const enteredValues = e?.target?.value;
      if (enteredValues && enteredValues?.length > 2) {
        setIsopicLoading(true);
        // setHaveTopicExist(true);
        getExistingList(enteredValues);
      } else {
        setHaveTopicExist(false);
      }
    }, 900),
    []
  );

  const onTopicNameBlur = () => {
    setIsError(false);
    if (
      values?.topic_name &&
      currentTopic?.topic_name?.trim() !== values?.topic_name?.trim()
    ) {
      getExistingList();
    }
  };

  return (
    <CustomSpinner key="create-topic-spinner" spinning={isLoading}>
      <Breadcrumbs
        items={[
          { icon: <HomeOutlined className="text-canBlack" />, href: "/" },
          {
            href: `/topic/history/${
              currentTopic?.topic_num
            }-${replaceSpecialCharacters(currentTopic?.topic_name, "-")}`,
            label: "Topic History",
          },
          { label: "Update Topic" },
        ]}
      />

      <Row gutter={20} className="mb-5">
        <Col lg={12}>
          <FromUI
            onFinish={onFinish}
            form={form}
            nameSpaces={nameSpaces || []}
            nickNameList={nickNameList || []}
            onCancel={onCancel}
            isDisabled={isDisabled && isSubmitReq}
            categories={catTaga}
            selectedCats={selectedCats}
            onCatRemove={onCatRemove}
            onTagSelect={onTagSelect}
            onTopicNameBlur={onTopicNameBlur}
            onTopicChange={onTopicChange}
            isEdit={true}
            values={values}
            isLoading={isLoading}
            editCampStatementData={editCampStatementData}
          />
        </Col>
        <Col lg={12}>
          {haveTopicExist ? (
            <ExistingTopicList
              topicName={values?.topic_name}
              data={existingTopics}
              isShowMore={isShowMore}
              isError={isError}
              isLoading={isTopicLoading}
            />
          ) : (
            <TopicInfoCard />
          )}
        </Col>
      </Row>
    </CustomSpinner>
  );
};

export default UpdateTopic;
