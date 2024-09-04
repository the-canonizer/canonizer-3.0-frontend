import { useState, useEffect, useCallback } from "react";
import { Col, Form, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import { HomeOutlined } from "@ant-design/icons";

import { createTopic } from "src/network/api/topicAPI";
import {
  getNickNameList,
  globalSearchCanonizer,
} from "src/network/api/userApi";
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
import { openNotificationWithIcon } from "components/common/notification/notificationBar";
import Breadcrumbs from "components/shared/Breadcrumbs";

const CreateNewTopic = () => {
  const { nameSpaces, catTaga } = useSelector((state: RootState) => ({
    nameSpaces: state.homePage.nameSpaces,
    catTaga: state?.tag?.tags,
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

  const router = useRouter();
  const dispatch = useDispatch();

  const { isUserAuthenticated } = isAuth();

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(true))
      .catch(() => setIsDisabled(false));
  }, [form, values]);

  const fetchNickNameList = async () => {
    setIsLoading(true);
    let response = await getNickNameList();
    if (response && response.status_code === 200) {
      const resData = response.data;
      setNickNameList(resData);
      form.setFieldValue("nick_name", resData[0]?.id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchNickNameList();
    }
    // eslint-disable-next-line
  }, [isUserAuthenticated]);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    const body = {
      topic_name: values.topic_name?.trim(),
      namespace: values.namespace,
      nick_name: values.nick_name,
      tags: selectedCats?.map((cat) => cat?.id),
    };

    const res = await createTopic(body);

    if (res && res.status_code === 400) {
      if (res?.error) {
        const errors_key = Object.keys(res.error);

        if (errors_key.length) {
          const fieldsToUpdate = errors_key
            .filter((key) => key !== "topic_name")
            .map((key) => ({
              name: [key],
              value: values[key],
              errors: [res.error[key]],
              touched: true,
              validating: true,
            }));

          if (fieldsToUpdate.length) {
            form.setFields(fieldsToUpdate);
          }

          if ("existed_topic_reference" in res.error) {
            const topicField = {
              name: ["topic_name"],
              value: values?.topic_name,
              errors: res?.error?.topic_name || [],
              touched: true,
              validating: true,
            };

            if (fieldsToUpdate.length) {
              form.setFields(fieldsToUpdate.concat([topicField]));
              console.warn(
                "--fieldsToUpdate---- ",
                fieldsToUpdate.concat([topicField])
              );
            }

            setIsDisabled(false);
            setIsError(true);
            getExistingList();
          }
        }
      }
    }

    if (res && res.status_code === 200) {
      openNotificationWithIcon(res.message, "success");
      storeFilterClear();
      router?.push({
        pathname: `/topic/${res.data.topic_num}-${replaceSpecialCharacters(
          res.data.topic_name,
          "-"
        )}/1-Agreement`,
      });

      dispatch(setShowDrawer(true));
    }

    setIsLoading(false);
  };

  console.log(form.getFieldError("topic_name"));

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

  const getExistingList = async (val = values?.topic_name) => {
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
        setExistingTopics(resData?.data?.topic);
        if (resData?.data?.topic?.length) {
          setHaveTopicExist(true);
        } else {
          setHaveTopicExist(false);
        }
      }

      if (resData?.meta_data?.total > 5) {
        setIsShowMore(true);
      } else {
        setIsShowMore(false);
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
        getExistingList(enteredValues);
      } else {
        setHaveTopicExist(false);
      }
    }, 900),
    []
  );

  const onTopicNameBlur = () => {
    setIsError(false);
  };

  return (
    <CustomSpinner key="create-topic-spinner" spinning={isLoading}>
      <Breadcrumbs
        items={[
          { icon: <HomeOutlined className="text-canBlack" />, href: "/" },
          { label: "Creating a New Topic" },
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
            isDisabled={isDisabled}
            categories={catTaga}
            selectedCats={selectedCats}
            onCatRemove={onCatRemove}
            onTagSelect={onTagSelect}
            onTopicNameBlur={onTopicNameBlur}
            onTopicChange={onTopicChange}
            values={values}
            isLoading={isLoading}
            editCampStatementData={null}
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

export default CreateNewTopic;
