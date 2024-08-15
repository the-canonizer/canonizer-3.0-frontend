import { Fragment } from "react";
import { Form, Row, Col, Typography } from "antd";
import {
  CloseOutlined,
  FileTextOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

import messages from "src/messages";
import { changeSlashToArrow } from "src/utils/generalUtility";
import Inputs from "components/shared/FormInputs";
import SelectInputs from "components/shared/FormInputs/select";
import AlignIcon from "./alignIcon";
import StructureIcon from "./structureIcon";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import CommonCards from "components/shared/Card";
import Tags from "components/shared/Tag";
import CustomSkelton from "components/common/customSkelton";

const { labels, placeholders, nickNmRule, topicNameRule, namespaceRule } =
  messages;

const CreateTopicFromUI = ({
  onFinish,
  form,
  nameSpaces,
  nickNameList,
  onCancel,
  isDisabled,
  categories,
  selectedCats,
  onCatRemove,
  onTagSelect,
  onTopicChange,
  onTopicNameBlur,
  values,
  isLoading,
  editCampStatementData,
  isEdit = false,
}) => {
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
    };

    if (nickNameList?.length) {
      selectInputProps.defaultValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.initialValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.key = "nickNamesWithKeyName";
    }
    return <SelectInputs {...selectInputProps} />;
  };

  return (
    <CommonCards className="border-0 bg-white">
      <header className="mb-14">
        <Typography.Paragraph className="text-xl text-canBlack font-medium">
          {isEdit ? "Update Topic" : "Creating a New Topic"}
        </Typography.Paragraph>
        <Typography.Paragraph className="text-canBlack opacity-80 mt-3">
          A topic on our platform refers to a specific subject within the
          context of the canon. It serves as a focal point for discussions,
          allowing users to explore and share opinions, ideas on a topic.
        </Typography.Paragraph>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        name="create_new_topic"
        className={`[&_label]:text-sm [&_label]:font-semibold [&_label]:text-canBlack [&_label_span]:ml-[4px] [&_label_span]:font-normal [&_label_span]:text-[#6e7880] [&_label_span]:text-[92%] [&_label]:before:absolute [&_label]:before:right-[-15px]`}
        layout={"vertical"}
        autoComplete="off"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={{
          topic_name: "",
          nick_name: values?.nick_name || nickNameList[0]?.id,
          namespace: values?.namespace || nameSpaces[0]?.id,
          tags: null,
        }}
      >
        <Row gutter={15}>
          <Col xs={24} sm={24}>
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <Inputs
                name="topic_name"
                label={
                  <Fragment>
                    {labels.cr_topic_name}
                    <span className="required">*</span>
                    <span>(Limit 30 Chars)</span>
                  </Fragment>
                }
                rules={topicNameRule}
                placeholder={placeholders.topicName}
                size={"large"}
                maxLength={30}
                prefix={
                  <div className="pr-3">
                    <AlignIcon fill="#242B37" />
                  </div>
                }
                onKeyDown={onTopicChange}
                onBlur={onTopicNameBlur}
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
            <div className="text-xs text-canRed -mt-4 mb-6">
              {labels.cr_nick_name_sp}
            </div>
          </Col>
          <Col xs={24} sm={12} key={"namespaces_div"}>
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              <SelectInputs
                label={
                  <Fragment>
                    {labels.cr_namespace}
                    <span className="required">*</span>
                    <span>
                      (General is recommended, unless you know otherwise)
                    </span>
                  </Fragment>
                }
                name="namespace"
                options={nameSpaces}
                placeholder={placeholders.namespace}
                size={"large"}
                defaultValue={values?.namespace || nameSpaces[0]?.id}
                initialValue={values?.namespace || nameSpaces[0]?.id}
                key={
                  "namespaces_label" + values?.namespace || nameSpaces[0]?.id
                }
                dataid="nick-namespace"
                allowClear
                showSearch
                optionFilterProp="children"
                inputClassName="border-0"
                rules={namespaceRule}
                prefix={
                  <StructureIcon
                    className="flex items-center justify-center px-2"
                    fill="#242B37"
                  />
                }
                isLabelRequiredFormat={true}
                formatFunc={changeSlashToArrow}
                onChange={(val) => form.setFieldValue("namespace", val)}
                onSearch={(val) => {
                  return;
                }}
                loading={isLoading}
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
              <SelectInputs
                label={labels.cateLabel}
                name="tags"
                options={categories}
                placeholder={placeholders.catSelect}
                allowClear
                size={"large"}
                dataid="topic-category"
                showSearch
                optionFilterProp="children"
                inputClassName="border-0"
                rules={null}
                nameKey="title"
                prefix={
                  <AlignIcon
                    className="flex items-center justify-center px-2"
                    fill="#242B37"
                  />
                }
                onChange={onTagSelect}
              />
            )}
          </Col>
          <Col xs={24} className="mb-5">
            {isLoading ? (
              <CustomSkelton
                skeltonFor="list"
                bodyCount={1}
                stylingClass="listSkeleton"
                isButton={false}
              />
            ) : (
              selectedCats?.map((cat) => (
                <Tags
                  className="rounded-lg py-2 px-6 border-canGrey2 text-canBlue bg-canGray mt-0 mb-2 font-medium"
                  key={cat?.id}
                >
                  <span>{cat?.title}</span>
                  <CloseOutlined
                    className="mr-2"
                    onClick={(e) => onCatRemove(e, cat)}
                  />
                </Tags>
              ))
            )}
          </Col>
          {isEdit && (
            <Col xs={24} xl={24}>
              <Inputs
                name="edit_summary"
                label={
                  <>
                    Add Summary Of Changes
                    <small className="ml-1">
                      (Briefly describe your changes)
                    </small>
                  </>
                }
                rules={messages.summaryRule}
                placeholder={messages.placeholders.firstName}
                maxLength={100}
                prefix={<FileTextOutlined />}
                defaultValue={String(editCampStatementData)}
              />
            </Col>
          )}
        </Row>

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
              id="create-topic-btn"
              data-testid="create-topic-btn"
              disabled={!isDisabled}
              className="flex justify-center items-center py-5 px-6"
            >
              {isEdit ? "Update Topic" : "Save Topic"} <SaveOutlined />
            </PrimaryButton>
          </div>
        )}
      </Form>
    </CommonCards>
  );
};

export default CreateTopicFromUI;
