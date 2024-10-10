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
      lastValue: form.getFieldValue("nick_name"),
      value: form.getFieldValue("nick_name"),
    };

    if (nickNameList?.length) {
      selectInputProps.defaultValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.initialValue = values?.nick_name || nickNameList[0]?.id;
      selectInputProps.key = "nickNamesWithKeyName";
    }
    return <SelectInputs {...selectInputProps} />;
  };

  const getNameSpacesValue = () => {
    if (isEdit) {
      return values?.namespace;
    }

    return values?.namespace || nameSpaces[0]?.id;
  };

  return (
    <CommonCards className="border-0 bg-white">
      <header className="mb-14">
        <Typography.Paragraph className="text-xl text-canBlack font-medium">
          {isEdit ? "Update Topic" : "Start a New Topic"}
        </Typography.Paragraph>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        name="create_new_topic"
        className={`[&_label]:text-sm [&_label]:font-medium [&_label]:text-canBlack [&_label_span]:ml-[4px] [&_label_span]:font-normal [&_label_span]:text-[#6e7880] [&_label_span]:text-[92%] [&_label]:before:absolute [&_label]:before:right-[-15px]`}
        layout={"vertical"}
        autoComplete="off"
        scrollToFirstError
        validateTrigger={messages.formValidationTypes()}
        initialValues={{
          topic_name: "",
          nick_name: values?.nick_name || nickNameList[0]?.id,
          namespace: getNameSpacesValue(),
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
                    <span>(Limit 80 Chars)</span>
                  </Fragment>
                }
                rules={topicNameRule}
                placeholder={placeholders.topicName}
                size={"large"}
                maxLength={80}
                prefix={
                  <div className="pr-3">
                    <AlignIcon fill="#242B37" />
                  </div>
                }
                onKeyUp={onTopicChange}
                onBlur={onTopicNameBlur}
                dataid="topic-name"
                key="topic-name-key"
              />
            )}
          </Col>
          <Col xs={24} sm={24} className="py-3 mb-4">
            <Typography.Paragraph className="text-canRed text-xs">
              {labels.cr_nick_name_sp}
            </Typography.Paragraph>
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
                    <span className="text-[10px]">
                      (General is recommended, unless you know otherwise)
                    </span>
                  </Fragment>
                }
                name="namespace"
                options={nameSpaces}
                placeholder={placeholders.namespace}
                allowClear
                size={"large"}
                dataid="canon-namespace"
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
                defaultValue={getNameSpacesValue()}
                initialValue={getNameSpacesValue()}
                value={form.getFieldValue("namespace")}
                isLabelRequiredFormat={true}
                formatFunc={changeSlashToArrow}
                onSelect={(val) => form.setFieldValue("namespace", val)}
                key="canon-select"
                lastValue={form.getFieldValue("namespace")}
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
                onSelect={onTagSelect}
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
                    className="mr-2 text-canLight"
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
                label="Add Summary Of Changes"
                rules={messages.summaryRule}
                placeholder={messages.placeholders.editSummary}
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
              className="mr-4 flex justify-center items-center py-5 px-6 w-[200px] border-canBlue"
            >
              Discard <CloseOutlined />
            </SecondaryButton>
            <PrimaryButton
              htmlType="submit"
              id="create-topic-btn"
              data-testid="create-topic-btn"
              disabled={!isDisabled}
              className="flex justify-center items-center py-5 px-6 w-[200px]"
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
