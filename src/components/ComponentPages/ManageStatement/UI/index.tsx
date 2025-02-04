import { Form, Row, Col, Typography, Modal } from "antd";
import dynamic from "next/dynamic";
import {
  CloseOutlined,
  EyeOutlined,
  FileTextOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";

import K from "src/constants";
import messages from "src/messages";
import CommonCards from "components/shared/Card";
import SelectInputs from "components/shared/FormInputs/select";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import Inputs from "components/shared/FormInputs";
import ManageStatementUISkelaton from "./skelaton";
import CustomSkelton from "components/common/customSkelton";
import { defaultNicknameData } from "src/utils/generalUtility";
import { uploadFile } from "src/network/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
// import StarIcon from "./starIcon";

//Ckeditor
const Editorckl = dynamic(() => import("components/common/editorck"), {
  ssr: false,
});

const EditorToolbarItems = [
  "heading",
  "|",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "superscript",
  "subscript",
  "|",
  "numberedList",
  "bulletedList",
  "alignment",
  "todoList",
  "|",
  "fontColor",
  "|",
  "indent",
  "outdent",
  "|",
  "link",
  "autolink",
  "imageInsert",
  "blockQuote",
  "insertTable",
  "mediaEmbed",
  "|",
  "findAndReplace",
  "horizontalLine",
  "pageBreak",
  "specialCharacters",
  "|",
  "undo",
  "redo",
];

function ManageStatementUI({
  form,
  handleformvalues,
  onFinish,
  screenLoading,
  nickNameData,
  isEdit,
  editorState,
  submitIsDisable,
  editCampStatementData,
  onDiscardClick,
  isDisabled,
  onPreviewClick,
  isDraft,
  autoSave,
  isAutoSaving,
  values,
  setEditorState,
  // onImproveClick,
  // isGenerating,
}) {
  const editorRef = useRef(null);
  const [alertModal, setAlertModal] = useState(false); // Controls modal visibility
  const [findLength, setFindlength] = useState(0);

  const onEditorStateChange = (changedata: any) => {
    // Convert the editor data to a string
    const datachangec = `${changedata}`;
    // Parse the content to look for anchor tags and add a style attribute for blue links
    setEditorState(datachangec); // Update editor state
    form.setFieldsValue({ statement: datachangec }); // Update form values
    handleformvalues();
  };

  const extractImgSrc = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const imgElement = doc.querySelector("img");
    return imgElement ? imgElement.src : null;
  };
  const convertBase64ToBinary = (base64Str) => {
    // Check if the string starts with a valid base64 prefix
    if (!base64Str.startsWith("data:image/")) {
      console.error("The provided string is not a base64-encoded image.");
      return null; // Return null for non-base64 strings
    }

    try {
      const byteCharacters = atob(base64Str.split(",")[1]); // Decode the base64 string
      const binaryData = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        binaryData[i] = byteCharacters.charCodeAt(i);
      }
      return binaryData;
    } catch (error) {
      console.error("Failed to decode base64 string:", error);
      return null;
    }
  };

  // Example base64 image string
  const { topicRecord } = useSelector((state: RootState) => ({
    topicRecord: state?.topicDetails?.currentTopicRecord,
  }));
  function handleButtonClick(e) {
    e.preventDefault(); // Prevent form submission by default

    // Match all <img> tags in the editorState
    const imgTags = editorState.match(/<img[^>]*>/gi);

    if (!imgTags || imgTags.length === 0) {
      return true;
    }

    // Maximum size in bytes (5 MB)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    // Array to hold oversized image names
    const oversized = [];

    // Prepare the FormData object
    const formData = new FormData();
    const folderId = ""; // Optional or empty
    let isImageUrl = false;
    imgTags.forEach((imgTag, index) => {
      const base64Image = extractImgSrc(imgTag);

      if (base64Image.startsWith("http") || base64Image.startsWith("https")) {
        isImageUrl = true;
        console.log(`Skipping image ${index + 1}: Linked image detected.`);
        return; // Skip images with external links
      }
      // Convert base64 to binary
      const binaryData = convertBase64ToBinary(base64Image);

      // Check if binaryData is valid
      if (!binaryData) {
        console.error(`No binary data found for image ${index + 1}`);
        return;
      }

      // Check the size of the binary data
      if (binaryData.byteLength > MAX_IMAGE_SIZE) {
        oversized.push(`Image ${index + 1} exceeds 5 MB.`);
        return;
      }

      // Create a unique name for each image
      const name = `${topicRecord?.topic_name}_${Date.now()}_${index + 1}.jpg`;

      // Add the binary data as a Blob to FormData
      const file = new Blob([binaryData], { type: "image/jpeg" });
      formData.append("file[]", file); // Add the binary file
      formData.append("name[]", name); // Add the file name
    });

    if (oversized.length > 0) {
      console.error("Oversized images detected:", oversized);
      setAlertModal(true); // Show alert modal if necessary
      return false; // Stop further execution
    }
    // Add folder_id (if applicable)
    formData.append("folder_id", folderId);

    // Call the uploadFile API
    if (!isImageUrl) {
      uploadFile(formData)
        .then((response) => {
          // Handle success
          console.log("Files uploaded successfully:", response);
        })
        .catch((error) => {
          // Handle error
          console.error("Error uploading files:", error);
        });
    }
    return true; // Allow form submission
  }

  function handleModalOk() {
    setAlertModal(false); // Close the modal
  }

  function handleModalCancel() {
    setAlertModal(false); // Close the modal
  }
  console.log(editorState, "editorState");
  return (
    <CommonCards className="border-0 bg-white" id="common-cards">
      <header className="mb-14" id="header">
        <Typography.Paragraph
          className="text-xl text-canBlack font-medium"
          id="header-title"
        >
          {isEdit ? "Update Camp Statement" : "Adding Camp Statement"}
        </Typography.Paragraph>
        <Typography.Paragraph
          className="text-canBlack opacity-80 mt-3"
          id="header-description"
        >
          Each camp features a statement summarizing the discussions within,
          providing a clear overview of the topic&lsquo;s various perspectives.
          This concise summary serves as a guide.
        </Typography.Paragraph>
      </header>
      {screenLoading ? (
        <ManageStatementUISkelaton isEdit={isEdit && !isDraft} />
      ) : (
        <Form
          form={form}
          layout={"vertical"}
          validateTrigger={messages.formValidationTypes()}
          initialValues={{
            available_for_child: 0,
            nick_name: defaultNicknameData(nickNameData)?.id
              ? defaultNicknameData(nickNameData)?.id
              : nickNameData[0]?.id,
          }}
          onValuesChange={handleformvalues}
          onFinish={onFinish}
          id="statement-form"
        >
          <Row gutter={28} id="form-row">
            <Col xs={24} sm={24} xl={12} id="nickname-col">
              <SelectInputs
                label={
                  <span className="ant-form-item-required">
                    Nickname <span className="required">*</span>
                  </span>
                }
                name="nick_name"
                defaultValue={
                  defaultNicknameData(nickNameData)?.id
                    ? defaultNicknameData(nickNameData)?.id
                    : nickNameData[0]?.id
                }
                options={nickNameData}
                allowClear
                size="large"
                dataid="topic-category"
                showSearch
                optionFilterProp="children"
                inputClassName="border-0"
                rules={[
                  {
                    required: true,
                    message: K?.exceptionalMessages?.selectNickNameErrorMsg,
                  },
                ]}
                nameKey="nick_name"
                prefix={<UserOutlined className="px-3 text-canBlack" />}
                key="statement-nicknames"
                onSelect={(val) => form.setFieldValue("nick_name", val)}
                lastValue={form.getFieldValue("nick_name")}
                id="nickname-select"
              />
            </Col>
            <Col xs={24} xl={24} id="statement-col">
              <p
                className="mt-1 mb-5 text-sm font-normal text-canBlack opacity-80"
                id="nickanme_note"
              >
                Note: The maximum allowed file size is 5 MB.
              </p>
              <Form.Item
                className="mb-2 editorContent [&_.ant-form-item-label>label]:w-full"
                name="statement"
                rules={[
                  {
                    required: true,
                    message: K?.exceptionalMessages?.statementRequiredErrorMsg,
                  },
                  {
                    pattern: /[^ \s]/,
                    message: K?.exceptionalMessages?.statementRequiredErrorMsg,
                  },
                ]}
                id="statement-form-item"
              >
                {screenLoading ? (
                  <CustomSkelton
                    bodyCount
                    stylingClass
                    isButton
                    height={250}
                    skeltonFor="video"
                    id="statement-skelton"
                  />
                ) : (
                  <Editorckl
                    ref={editorRef}
                    editorState={editorState}
                    oneditorchange={onEditorStateChange}
                    placeholder="Write Your Statement Here"
                    items={EditorToolbarItems}
                    saveContent={async (data, index) => {
                      const imgTags = data.match(/<img[^>]*>/gi);
                      let oversizedImageDetected = false;
                      const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
                      let updatedData = data;
                      let imageIndex = 0; // Start indexing based on the provided index
                      setFindlength(imgTags?.length);
                      if (imgTags && findLength < imgTags.length) {
                        for (let imgTag of imgTags) {
                          imageIndex = imageIndex + 1;
                          const formData = new FormData();
                          const srcMatch = imgTag.match(/src="([^"]*)"/i);
                          if (srcMatch && srcMatch[1]) {
                            const imgSrc = srcMatch[1];

                            if (
                              imgSrc.startsWith("http") ||
                              imgSrc.startsWith("https")
                            ) {
                              continue;
                            }

                            if (imgSrc.startsWith("data:image/")) {
                              const base64String = imgSrc.split(",")[1];
                              const fileSizeInBytes =
                                (base64String.length * 3) / 4 -
                                (base64String.endsWith("==")
                                  ? 2
                                  : base64String.endsWith("=")
                                  ? 1
                                  : 0);

                              if (fileSizeInBytes >= MAX_IMAGE_SIZE) {
                                oversizedImageDetected = true;
                                setAlertModal(true);
                                console.warn(
                                  "Skipping oversized image:",
                                  fileSizeInBytes
                                );
                                continue;
                              }

                              const binaryData = atob(base64String);
                              const arrayBuffer = new Uint8Array(
                                binaryData.length
                              );
                              for (let i = 0; i < binaryData.length; i++) {
                                arrayBuffer[i] = binaryData.charCodeAt(i);
                              }
                              const file = new Blob([arrayBuffer], {
                                type: "image/jpeg",
                              });

                              // Use only index for unique naming
                              const name = `${
                                topicRecord?.topic_name
                              }_${Date.now()}_${imageIndex}.jpg`;
                              imageIndex++; // Increment index

                              formData.append("file[]", file);
                              formData.append("name[]", name);

                              try {
                                const response = await uploadFile(formData);
                                const uploadedUrl =
                                  response?.data?.[0]?.short_code_path;
                                const shortCodepath = response?.data?.map(
                                  (obj) => {
                                    return obj?.short_code_path;
                                  }
                                );
                                if (uploadedUrl) {
                                  updatedData = updatedData.replace(
                                    imgSrc,
                                    uploadedUrl
                                  );
                                }
                              } catch (error) {
                                console.error("Error uploading image:", error);
                              }
                            }
                          }
                        }
                      }

                      if (!oversizedImageDetected) {
                        autoSave({
                          statement: updatedData,
                          nick_name: values?.nick_name,
                        });
                      } else {
                        console.warn(
                          "AutoSave skipped due to oversized image."
                        );
                      }
                    }}
                    id="statement-editor"
                  ></Editorckl>
                )}
              </Form.Item>
            </Col>
            {isEdit && !isDraft && (
              <Col xs={24} xl={24} className="mt-6" id="edit-summary-col">
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
                  placeholder={messages.placeholders.editSummary}
                  maxLength={100}
                  prefix={<FileTextOutlined />}
                  defaultValue={String(editCampStatementData)}
                  id="edit-summary-input"
                />
              </Col>
            )}
            <Col
              xs={24}
              xl={24}
              className="flex justify-between items-center pt-5 mt-3 flex-wrap gap-5"
              id="form-actions-col"
            >
              <Form.Item
                className="mb-0 [&_.ant-form-item-control-input-content]:flex [&_.ant-form-item-control-input-content]:gap-5 [&_.ant-form-item-control-input-content]:flex-wrap"
                id="form-actions"
              >
                <SecondaryButton
                  className="inline-flex items-center justify-center h-auto py-2 px-7 mr-5 h-auto"
                  onClick={onDiscardClick}
                  id="discard-button"
                  disabled={isAutoSaving}
                >
                  Discard <CloseOutlined />
                </SecondaryButton>
                <PrimaryButton
                  htmlType="submit"
                  className="inline-flex items-center justify-center h-auto py-2 px-7 h-auto"
                  disabled={
                    (submitIsDisable && isEdit) || !isDisabled || isAutoSaving
                  }
                  id="publish-button"
                >
                  {isAutoSaving ? (
                    "Saving as draft ..."
                  ) : (
                    <>
                      Publish Statement
                      <UploadOutlined className="ml-2" />
                    </>
                  )}
                </PrimaryButton>
              </Form.Item>
              <SecondaryButton
                className="!border-0 flex items-center justify-center !shadow-none h-auto"
                onClick={onPreviewClick}
                id="preview-button"
              >
                Preview Statement <EyeOutlined />
              </SecondaryButton>
            </Col>
          </Row>
        </Form>
      )}
      <Modal
        className="[&_.ant-modal-content]:!rounded-xl [&_.ant-modal-header]:rounded-tl-xl [&_.ant-modal-header]:rounded-tr-xl"
        open={alertModal}
        title={
          <span className="text-lg font-medium"> Alert: Image size exceed</span>
        }
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={null}
      >
        {/* <ul>
          {oversizedImages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul> */}
        <span className="text-lg font-medium">
          This image is not uploaded because its file size exceeds 5 MB.
        </span>
      </Modal>
    </CommonCards>
  );
}

export default ManageStatementUI;
