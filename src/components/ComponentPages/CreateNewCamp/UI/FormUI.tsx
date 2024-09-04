import { Fragment, useEffect, useState } from "react";
import { Form, Input, Select, Row, Col, Typography, Tooltip } from "antd";
import {
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
import StructureIcon from "components/ComponentPages/CreateNewTopic/UI/structureIcon";

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
}) => {
  const router = useRouter();
  const historyOf = router?.asPath.split("/")?.at(2);
  const objection =
    router?.query?.[historyOf]?.at(0)?.split("-")?.at(1) == "objection";

  const { campRecord, topicRecord, filterObject } = useSelector(
    (state: RootState) => ({
      campRecord: state?.topicDetails?.currentCampRecord,
      topicRecord: state?.topicDetails?.currentTopicRecord,
      filterObject: state?.filters?.filterObject,
    })
  );

  const [isAboutFocused, setIsAboutFocused] = useState(false);
  const [isCampLeaderFocused, setIsCampLeaderFocused] = useState(false);

  // const toolTipContent = "This camp is under review";
  const archiveToolTipContent = "This camp is archived";

  useEffect(() => {
    campRecord?.is_archive && router.pathname == "/camp/create/[...camp]"
      ? router?.back()
      : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      values: values?.nick_name || nickNameList[0]?.id,
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
      key: "parent_camp_numKeys",
      name: "parent_camp_num",
      options: parentCamp,
      nameKey: "camp_name",
      placeholder: placeholders.nickName,
      allowClear: true,
      size: "large",
      dataid: "nick-name",
      showSearch: true,
      optionFilterProp: "children",
      inputClassName:
        "border-0 [&_.ant-select-selector]:![&_.ant-select-selection-search]:!w-auto",
      rules: parentCampRule,
      prefix: (
        <StructureIcon
          className="flex items-center justify-center px-2"
          fill="#242B37"
        />
      ),
      onSelect: (val) => form.setFieldValue("parent_camp_num", val),
      id: "nickname-dropdown",
      values: values?.parent_camp_num || topicData?.camp_num,
      isDefaultOption: false,
      // onBlur: () => console.log("parent_camp_num", form.getFieldInstance('parent_camp_num')),
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
    };

    if (parentCamp?.length) {
      selectInputProps.defaultValue =
        values?.parent_camp_num || topicData?.camp_num;
      selectInputProps.initialValue =
        values?.parent_camp_num || topicData?.camp_num;
      selectInputProps.key = "parentcampNamesWithKeyName";
    }
    return <SelectInputs {...selectInputProps} disabled={objection} />;
  };

  const formInitValue = {
    ...initialValue,
    nick_name: values?.nick_name || parentCamp[0]?.id,
    parent_camp_num: values?.parent_camp_num || topicData?.camp_num,
  };

  const getCampLeaderNickName = () => {
    return (
      campLeaderData &&
      campLeaderData?.find((CL) => CL?.camp_leader === true)?.nick_name
    );
  };

  return (
    <Fragment>
      <CommonCards className="border-0 bg-white">
        <header className="mb-14">
          <Typography.Paragraph className="text-xl text-canBlack font-medium">
            {objection ? "Submit Objection" : isEdit ? "Update Camp" : "Creating a New Camp"}
          </Typography.Paragraph>
          <Typography.Paragraph className="text-canBlack opacity-80 mt-3">
            {objection?"Input information required to submit an objection.":`Input information required to ${isEdit ? "update" : "create"} a camp.`}
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
        >
          <Row gutter={16}>
            <Col md={24}>
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <Inputs
                  label={
                    <Fragment>
                      {labels.cr_camp_name}
                      <span className="required">*</span>
                    </Fragment>
                  }
                  name="camp_name"
                  rules={campNameRule}
                  placeholder="Camp name"
                  size={"large"}
                  maxLength={30}
                  prefix={
                    <div className="pr-3">
                      <AlignIcon fill="#242B37" />
                    </div>
                  }
                  onKeyUp={onCampChange}
                  onBlur={onCampNameBlur}
                  disabled={!!(parentCamp.length < 1 || objection)}
                />
              )}
            </Col>
            <Col xs={24} sm={12}>
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                getNickNameInput()
              )}
            </Col>
            {parentCamp.length >= 1 && (
              <Col xs={24} sm={12}>
                {isLoading ? (
                  <CustomSkelton
                    skeltonFor="list"
                    bodyCount={1}
                    stylingClass="listSkeleton"
                    isButton={false}
                  />
                ) : (
                  getParentCampInput()
                )}
              </Col>
            )}
            {isEdit && !objection && (
              <Fragment>
                <Col xs={24} sm={24} xl={24}>
                  <Form.Item
                    label={
                      <Fragment>
                        Camp Leader
                        {campLeaderData &&
                        campLeaderData?.find(
                          (CL) => CL?.camp_leader === true
                        ) ? (
                          <span>
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
                              <a className="text-canBlue">
                                {getCampLeaderNickName() + " "}
                              </a>
                            </Link>
                            is currently the camp leader )
                          </span>
                        ) : (
                          <span>(No one is currently camp leader)</span>
                        )}
                      </Fragment>
                    }
                    name="camp_leader_nick_id"
                    className={`text-14 text-canBlack font-medium`}
                  >
                    {isLoading ? (
                      <CustomSkelton
                        skeltonFor="list"
                        bodyCount={1}
                        stylingClass="listSkeleton"
                        isButton={false}
                      />
                    ) : (
                      <div
                        className={`outerDiv flex border rounded ${
                          isCampLeaderFocused
                            ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
                            : ""
                        }`}
                      >
                        <CrownOutlined className="px-3 text-canBlack" />
                        <Select
                          showSearch
                          size={"large"}
                          placeholder="Camp Leader"
                          defaultValue={getCampLeaderNickName()}
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
                        >
                          {campLeaderData?.length > 0 &&
                            campLeaderData?.map((lead) => (
                              <Select.Option
                                value={lead.nick_name_id}
                                key={lead?.nick_name_id}
                              >
                                {lead?.nick_name}
                              </Select.Option>
                            ))}
                        </Select>
                      </div>
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label={labels.cr_edit_summary}
                    name="note"
                    {...summaryRule}
                    className={`text-14 text-canBlack font-medium`}
                  >
                    <Input.TextArea
                      rows={6}
                      placeholder={placeholders.editSummary}
                      className="rounded-lg"
                      onChange={(e) =>
                        form.setFieldValue("note", e?.target?.value)
                      }
                    />
                  </Form.Item>
                </Col>
              </Fragment>
            )}
          </Row>
          {!objection && (
            <>
              <Row gutter={16} className="bg-canGray mb-3 py-3 rounded-lg">
                <Col xs={24} sm={24}>
                  <Text className="mt-1 mb-4 block text-canRed">
                    {labels.cr_keywords_sp}
                  </Text>
                </Col>

                <Col xs={24} sm={12}>
                  {isLoading ? (
                    <CustomSkelton
                      skeltonFor="list"
                      bodyCount={1}
                      stylingClass="listSkeleton"
                      isButton={false}
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
                    />
                  )}
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label={labels.cr_nick_name_about}
                    name="camp_about_nick_id"
                    className={`text-14 text-canBlack font-medium`}
                    initialValue={values?.camp_about_nick_id}
                  >
                    {isLoading ? (
                      <CustomSkelton
                        skeltonFor="list"
                        bodyCount={1}
                        stylingClass="listSkeleton"
                        isButton={false}
                      />
                    ) : (
                      <div
                        className={`outerDiv flex border rounded ${
                          isAboutFocused
                            ? "border-[#40a9ff] shadow-[0 0 0 2px rgba(24, 144, 255, 0.2)"
                            : ""
                        }`}
                      >
                        <UserOutlined className="px-3 text-canBlack bg-white" />
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
            </>
          )}

          {!objection && (
            <>
              <Row gutter={16}>
                <Col className="flex flex-col [&_.ant-checkbox-wrapper]:ml-0 [&_.ant-checkbox-wrapper]:mb-4 [&_.ant-checkbox-wrapper>span]:text-canBlack [&_.ant-checkbox-wrapper>span]:text-sm [&_.ant-checkbox-wrapper>span]:font-medium">
                  <PreventSubCamps
                    options={options}
                    onCheckboxChange={onCheckboxChange}
                  />
                </Col>
              </Row>
            </>
          )}

          {objection && (
            <Input.TextArea
              size="large"
              rows={1}
              maxLength={100}
              className="mb-6"
            />
          )}

          {objection ? (
            <>
              <PrimaryButton
                htmlType="submit"
                id="crate-camp-btn"
                data-testid="btn"
                className="flex justify-center items-center py-5 px-6"
              >
                {"Submit Objection"}
              </PrimaryButton>
            </>
          ) : (
            <>
              {isLoading ? (
                <CustomSkelton
                  skeltonFor="list"
                  bodyCount={1}
                  stylingClass="listSkeleton"
                  isButton={false}
                />
              ) : (
                <div className="mt-4 flex justify-start items-center">
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
                    id="crate-camp-btn"
                    data-testid="btn"
                    disabled={!isDisabled}
                    className="flex justify-center items-center py-5 px-6"
                  >
                    {isEdit ? "Update Camp" : "Create Camp"} <SaveOutlined />
                  </PrimaryButton>
                </div>
              )}
            </>
          )}
        </Form>
      </CommonCards>
    </Fragment>
  );
};

export default CreateCampFormUI;
