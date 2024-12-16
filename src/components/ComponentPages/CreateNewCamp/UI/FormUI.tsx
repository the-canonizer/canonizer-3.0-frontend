import { Fragment, useEffect, useState } from "react";
import { Form, Input, Select, Row, Col, Typography, Tooltip } from "antd";
import {
  ApartmentOutlined,
  CloseOutlined,
  CrownOutlined,
  LinkOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import messages from "src/messages";
import PreventSubCamps from "components/common/preventSubCampCheckbox";
import { RootState } from "src/store";
import CommonCards from "components/shared/Card";
import CustomSkelton from "components/common/customSkelton";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import AlignIcon from "components/ComponentPages/CreateNewTopic/UI/alignIcon";
import SelectInputs from "components/shared/FormInputs/select";

const { Option } = Select;
const { Text } = Typography;

const {
  labels,
  placeholders,
  nickNmRule,
  summaryRule,
  campNameRule,
  campAboutUrlRule,
  parentCampRule,
} = messages;

const CreateCampFormUI = ({
  onFinish,
  onCancel,
  form,
  initialValue,
  topicData,
  nickNameList,
  parentCamp,
  campNickName,
  options,
  onCheckboxChange,
  isLoading,
  isEdit,
  isDisabled,
  onCampChange,
  onCampNameBlur,
  values,
  campLeaderData = null,
  getCampLeaderData,
}: any) => {
  const router = useRouter();

  const { campRecord, topicRecord, filterObject } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      filterObject: state?.filters?.filterObject,
    })
  );

  const [isAboutFocused, setIsAboutFocused] = useState(false);
  const [isCampLeaderFocused, setIsCampLeaderFocused] = useState(false);

  const archiveToolTipContent = "This camp is archived";

  useEffect(() => {
    campRecord?.is_archive && router.pathname == "/camp/create/[...camp]"
      ? router?.back()
      : "";
  }, []);

  const getNickNameInput = () => {
    const selectInputProps: any = {
      label: (
        <Fragment>
          {labels.cr_nick_name}
          <span className="required">*</span>
        </Fragment>
      ),
      key: "nickNamesKeyName",
      name: "nick_name",
      options: nickNameList,
      nameKey: "nick_name",
      placeholder: placeholders.nickName,
      allowClear: true,
      size: "large",
      dataid: "nick-name",
      showSearch: true,
      optionFilterProp: "children",
      inputClassName:
        "border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto",
      rules: nickNmRule,
      prefix: <UserOutlined className="px-3 text-canBlack" />,
      onSelect: (val) => form.setFieldValue("nick_name", val),
      id: "nickname-dropdown",
      value: values?.nick_name || nickNameList[0]?.id,
      lastValue: form.getFieldValue("nick_name"),
    };

    if (nickNameList?.length) {
      selectInputProps.defaultValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.initialValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.key = "nickNamesWithKeyName";
    }
    return <SelectInputs {...selectInputProps} />;
  };

  const getParentCampInput = () => {
    const selectInputProps: any = {
      label: (
        <>
          {labels.cr_parent_camp}
          <span className="required">*</span>
        </>
      ),
      key: "parent_camp_numKeys_",
      name: "parent_camp_num",
      options: parentCamp,
      nameKey: "camp_name",
      placeholder: "Parent camp",
      allowClear: true,
      size: "large",
      dataid: "parent-camp-name",
      showSearch: true,
      optionFilterProp: "children",
      filterOption: (input, option) =>
        ((option?.children as any)?.props?.children ?? "")
          .toLowerCase()
          .includes(input.toLowerCase()),
      inputClassName:
        "border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto",
      rules: parentCampRule,
      prefix: <ApartmentOutlined className="px-3 text-canBlack" />,
      onSelect: (val) => form.setFieldValue("parent_camp_num", val),
      id: "parent-camp-dropdown",
      isDefaultOption: false,
      optionsData: parentCamp.map((camp) => (
        <Option
          value={camp.camp_num}
          key={camp.id}
          id={`parent-camp-${camp.id}`}
          camp={camp}
          disabled={camp.is_archive ? true : false}
        >
          <Tooltip title={camp.is_archive ? archiveToolTipContent : null}>
            {camp.camp_name}
          </Tooltip>
        </Option>
      )),
      value: values?.parent_camp_num || topicData?.camp_num,
      lastValue: form.getFieldValue("parent_camp_num"),
    };

    if (parentCamp?.length) {
      selectInputProps.defaultValue =
        values?.parent_camp_num || topicData?.camp_num;
      selectInputProps.initialValue =
        values?.parent_camp_num || topicData?.camp_num;
      selectInputProps.key = "parent_camp_numKeys_Name";
    }

    return <SelectInputs {...selectInputProps} />;
  };

  const formInitValue = {
    ...initialValue,
    nick_name: values?.nick_name || parentCamp[0]?.id,
    parent_camp_num: values?.parent_camp_num || topicData?.camp_num,
  };

  return (
    <CommonCards className="border-0 bg-white" id="common-cards">
      <header className="mb-14" id="header">
        <Typography.Paragraph
          className="text-xl text-canBlack font-medium"
          id="header-title"
        >
          {isEdit ? "Update Camp" : "Creating a New Camp"}
        </Typography.Paragraph>
        <Typography.Paragraph
          className="text-canBlack opacity-80 mt-3"
          id="header-subtitle"
        >
          Input information required to {isEdit ? "update" : "create"} a camp.
        </Typography.Paragraph>
      </header>
      <Form
        autoComplete="off"
        form={form}
        onFinish={onFinish}
        name="create_new_camp"
        className={`[&_label]:text-sm [&_label]:font-semibold [&_label]:text-canBlack [&_label_span]:ml-[4px] [&_label_span]:font-normal [&_label_span]:text-[#6e7880] [&_label_span]:text-[92%] [&_label]:before:absolute [&_label]:before:right-[-15px]`}
        layout={"vertical"}
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={formInitValue}
        id="create-new-camp-form"
      >
        <Row gutter={16} id="form-row-1">
          <Col md={24} id="form-col-camp-name">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="camp-name-skeleton"
              />
            ) : (
              <Inputs
                label={
                  <Fragment>
                    {labels.cr_camp_name}
                    <span className="required">*</span>
                    <span>(Limit 80 Chars)</span>
                  </Fragment>
                }
                name="camp_name"
                rules={campNameRule}
                placeholder="Camp name"
                size={"large"}
                maxLength={80}
                prefix={
                  <div className="pr-3">
                    <AlignIcon fill="#242B37" />
                  </div>
                }
                onKeyUp={onCampChange}
                onBlur={onCampNameBlur}
                disabled={!!(parentCamp.length < 1)}
                id="camp-name-input"
              />
            )}
          </Col>
          <Col xs={24} sm={12} id="form-col-nick-name">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="nick-name-skeleton"
              />
            ) : (
              getNickNameInput()
            )}
          </Col>
          {parentCamp.length >= 1 && (
            <Col xs={24} sm={12} id="form-col-parent-camp">
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                  id="parent-camp-skeleton"
                />
              ) : (
                getParentCampInput()
              )}
            </Col>
          )}
          {isEdit && (
            <Fragment>
              <Col
                xs={24}
                sm={parentCamp.length >= 1 ? 24 : 12}
                xl={parentCamp.length >= 1 ? 24 : 12}
                id="form-col-camp-leader"
              >
                <Form.Item
                  label="Camp Leader"
                  extra={
                    initialValue && initialValue?.camp_leader_nick_id ? (
                      <span className="text-[10px]">
                        (
                        <Link
                          href={`/user/supports/${
                            campLeaderData &&
                            campLeaderData?.find(
                              (CL) => CL?.camp_leader === true
                            )?.nick_name_id
                          }?canon=${
                            topicRecord?.namespace_id
                              ? topicRecord?.namespace_id
                              : filterObject?.namespace_id
                          }`}
                        >
                          <a className="text-canBlue" id="camp-leader-link">
                            {getCampLeaderData() + " "}
                          </a>
                        </Link>
                        is currently the camp leader )
                      </span>
                    ) : (
                      <span className="text-[10px]">
                        (No one is currently camp leader)
                      </span>
                    )
                  }
                  name="camp_leader_nick_id"
                  className={`text-14 text-canBlack font-medium`}
                  id="camp-leader-item"
                >
                  {isLoading ? (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={1}
                      stylingClass="listSkeleton"
                      isButton={false}
                      id="camp-leader-skeleton"
                    />
                  ) : (
                    <div
                      className={`outerDiv flex border rounded ${
                        isCampLeaderFocused
                          ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
                          : ""
                      }`}
                      id="camp-leader-select-wrapper"
                    >
                      <CrownOutlined
                        className="px-3 text-canBlack"
                        id="camp-leader-icon"
                      />
                      <Select
                        showSearch
                        size={"large"}
                        placeholder="Camp Leader"
                        defaultValue={getCampLeaderData()}
                        optionFilterProp="children"
                        allowClear={false}
                        filterOption={(input, option) =>
                          ((option?.children as any)?.props?.children ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto commonSelectClass`}
                        onFocus={() => setIsCampLeaderFocused(true)}
                        onBlur={() => setIsCampLeaderFocused(false)}
                        onChange={(val) =>
                          form.setFieldValue("camp_leader_nick_id", val)
                        }
                        id="camp-leader-select"
                      >
                        {campLeaderData?.length > 0 &&
                          campLeaderData?.map((lead) => (
                            <Select.Option
                              value={lead.nick_name_id}
                              key={lead?.nick_name_id}
                              id={`camp-leader-option-${lead?.nick_name_id}`}
                            >
                              {lead?.nick_name}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  )}
                </Form.Item>
              </Col>
              <Col span={24} id="form-col-note">
                <Form.Item
                  label={labels.cr_edit_summary}
                  name="note"
                  {...summaryRule}
                  className={`text-14 text-canBlack font-medium`}
                  id="note-item"
                >
                  <Input.TextArea
                    rows={6}
                    placeholder={placeholders.editSummary}
                    className="rounded-lg"
                    onChange={(e) =>
                      form.setFieldValue("note", e?.target?.value)
                    }
                    maxLength={500}
                    id="note-textarea"
                  />
                </Form.Item>
              </Col>
            </Fragment>
          )}
        </Row>

        <Row
          gutter={16}
          className="bg-canGray mb-3 py-3 rounded-lg"
          id="form-row-2"
        >
          <Col xs={24} sm={24} id="form-col-keywords">
            <Text className="mt-1 mb-4 block text-canRed" id="keywords-text">
              {labels.cr_keywords_sp}
            </Text>
          </Col>

          <Col xs={24} sm={12} id="form-col-camp-url">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
                id="camp-url-skeleton"
              />
            ) : (
              <Inputs
                label={labels.cr_camp_url}
                name="camp_about_url"
                rules={campAboutUrlRule}
                placeholder="Enter Here"
                size={"large"}
                maxLength={1024}
                prefix={
                  <div className="pr-3">
                    <LinkOutlined />
                  </div>
                }
                id="camp-url-input"
              />
            )}
          </Col>

          <Col xs={24} sm={12} id="form-col-camp-about-nick">
            <Form.Item
              label={labels.cr_nick_name_about}
              name="camp_about_nick_id"
              className={`text-14 text-canBlack font-medium`}
              initialValue={values?.camp_about_nick_id}
              id="camp-about-nick-item"
            >
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                  id="camp-about-nick-skeleton"
                />
              ) : (
                <div
                  className={`outerDiv flex border rounded ${
                    isAboutFocused
                      ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
                      : ""
                  }`}
                  id="camp-about-nick-select-wrapper"
                >
                  <UserOutlined
                    className="px-3 text-canBlack bg-white"
                    id="camp-about-nick-icon"
                  />
                  <Select
                    placeholder={placeholders.campAboutNickName}
                    allowClear
                    size={"large"}
                    data-id="camp-about-nick-id"
                    showSearch
                    optionFilterProp="children"
                    id="camp-about-nick-dropdown"
                    className={`text-canBlack font-normal h-[40px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto commonSelectClass`}
                    onFocus={() => setIsAboutFocused(true)}
                    onBlur={() => setIsAboutFocused(false)}
                    onChange={(val) =>
                      form?.setFieldValue("camp_about_nick_id", val)
                    }
                    defaultValue={values?.camp_about_nick_id}
                    value={values?.camp_about_nick_id}
                  >
                    <Option value="" id="camp-about-nick-custom">
                      {placeholders.campAboutNickName}
                    </Option>
                    {campNickName.map((nc) => (
                      <Option
                        value={nc.id}
                        key={nc.id}
                        id={`camp-about-nick-${nc.id}`}
                      >
                        {nc.nick_name}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} id="form-row-3">
          <Col
            className="flex flex-col [&_.ant-checkbox-wrapper]:ml-0 [&_.ant-checkbox-wrapper]:mb-4 [&_.ant-checkbox-wrapper>span]:text-canBlack [&_.ant-checkbox-wrapper>span]:text-sm [&_.ant-checkbox-wrapper>span]:font-medium"
            id="form-col-prevent-sub-camps"
          >
            <PreventSubCamps
              options={options}
              onCheckboxChange={onCheckboxChange}
              id="prevent-sub-camps"
            />
          </Col>
        </Row>

        {isLoading ? (
          <CustomSkelton
            skeltonFor="list"
            bodyCount={1}
            stylingClass="listSkeleton"
            isButton={false}
            id="form-skeleton"
          />
        ) : (
          <div
            className="mt-4 flex justify-start items-center"
            id="form-buttons"
          >
            <SecondaryButton
              onClick={onCancel}
              id="cancel-btn"
              data-testid="cancel-btn"
              className="mr-4 flex justify-center items-center py-5 px-6"
            >
              Discard <CloseOutlined />
            </SecondaryButton>
            <PrimaryButton
              htmlType="submit"
              id="create-camp-btn"
              data-testid="btn"
              disabled={!isDisabled}
              className="flex justify-center items-center py-5 px-6"
            >
              {isEdit ? "Update Camp" : "Create Camp"} <SaveOutlined />
            </PrimaryButton>
          </div>
        )}
      </Form>
    </CommonCards>
  );
};

export default CreateCampFormUI;
