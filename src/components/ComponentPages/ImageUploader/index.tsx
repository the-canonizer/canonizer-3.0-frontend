/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Tooltip, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteProfileImage,
  uploadProfileImage,
} from "src/network/api/userApi";
import { RootState } from "src/store";
import { setProfilePicture } from "src/store/slices/authSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ImageUploader: React.FC = () => {
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { userProfileImage } = useSelector((state: RootState) => ({
    userProfileImage: state.auth.loggedInUser?.profile_picture,
  }));

  useEffect(() => {
    userProfileImage
      ? setFileList([
          {
            uid: "-1",
            name: "Profile picture",
            status: "done",
            url: userProfileImage,
          },
        ])
      : setFileList([]);
  }, [userProfileImage]);

  const handleCancelPreview = () => setPreviewVisible(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleDelete = async (file: UploadFile) => {
    setLoading(true);
    try {
      await deleteProfileImage();
      const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(updatedFileList);
      dispatch(setProfilePicture(null));
      setLoading(false);
      message.success("Image deleted successfully");
    } catch (error) {
      setFileList([]);
      setLoading(false);
      message.error("Failed to delete image");
    }
  };

  const uploadButton = (
    <div>
      <UploadOutlined
        style={{ fontSize: "24px", color: "rgba(64, 169, 255, 1)" }}
        width="60px"
      />
    </div>
  );

  const onModalOk = async (file) => {
    setLoading(true);
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file?.type)) {
      setLoading(false);
      message.error(
        "The profile picture must be a file of type: png, jpg, jpeg"
      );
    } else {
      try {
        const formData = new FormData();
        formData.append("profile_picture", file as File);
        const response = await uploadProfileImage(formData);
        const imageUrl = response.data.profile_picture;
        dispatch(setProfilePicture(imageUrl));
        setLoading(false);
        if (response?.status_code === 200) {
          message.success("Upload successful");
        }
      } catch (error) {
        setLoading(false);
        message.error(error?.error?.data?.error?.profile_picture[0]);
      }
    }
  };
  return (
    <Fragment>
      <div className="upload-wrap">
        {fileList.length == 1 && !loading ? (
          <>
            <ImgCrop
              aspectSlider
              rotationSlider
              onModalOk={(file) => onModalOk(file)}
            >
              <Upload
                className="picture-upload"
                listType="picture-card"
                accept="image/*"
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={handleDelete}
                showUploadList={{ showRemoveIcon: true }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>
          </>
        ) : loading ? (
          <div style={{ padding: "50px" }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 24,
                  }}
                  spin
                />
              }
            />
          </div>
        ) : (
          <ImgCrop
            aspectSlider
            rotationSlider
            onModalOk={(file) => onModalOk(file)}
          >
            <Upload
              className="picture-upload"
              listType="picture-card"
              accept="image/*"
              fileList={fileList}
              onPreview={handlePreview}
              onRemove={handleDelete}
              showUploadList={{ showRemoveIcon: true }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </ImgCrop>
        )}
        {fileList.length >= 1 && !loading ? (
          <ImgCrop
            aspectSlider
            rotationSlider
            onModalOk={(file) => onModalOk(file)}
          >
            <Upload
              fileList={fileList}
              multiple={false}
              accept="image/*"
              showUploadList={false}
            >
              <Tooltip title="Update" key="update-btn" placement="bottom">
                <Button size="small">
                  <EditOutlined />
                </Button>
              </Tooltip>
            </Upload>
          </ImgCrop>
        ) : null}
      </div>
      <Modal
        visible={isPreviewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
      >
        <img
          alt="example"
          style={{ width: "100%", borderRadius: "50px" }}
          src={previewImage}
        />
      </Modal>
    </Fragment>
  );
};

export default ImageUploader;
