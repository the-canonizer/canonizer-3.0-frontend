import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import {
  deleteProfileImage,
  uploadProfileImage,
} from "src/network/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { setProfilePicture } from "src/store/slices/authSlice";

const MAX_IMAGE_SIZE_MB = 5; // Maximum image size in megabytes
const MAX_IMAGE_WIDTH = 1000; // Maximum image width in pixels
const MAX_IMAGE_HEIGHT = 1000; // Maximum image height in pixels

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

  const validateImage = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Validate image dimensions
        if (img.width > MAX_IMAGE_WIDTH || img.height > MAX_IMAGE_HEIGHT) {
          message.error(
            `Image dimensions should be within ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT} pixels.`
          );
          resolve(null);
        } else {
          resolve("valid");
        }
      };
      img.onerror = () => {
        message.error("Invalid image file.");
        resolve(null);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const lastFile = newFileList[newFileList.length - 1];
    if (lastFile) {
      const validationStatus = await validateImage(
        lastFile.originFileObj as File
      );
      if (validationStatus !== null) {
        // setFileList(newFileList);
        try {
          const formData = new FormData();
          formData.append("profile_picture", lastFile.originFileObj as File);
          const response = await uploadProfileImage(formData);
          const imageUrl = response.data.profile_picture;
          dispatch(setProfilePicture(imageUrl));
          message.success("Upload successful");
        } catch (error) {
          message.error("Upload failed");
        }
      } else {
        // Remove the invalid file from the fileList
        newFileList.pop();
        setFileList(newFileList);
      }
    }
  };

  const handleDelete = async (file: UploadFile) => {
    try {
      await deleteProfileImage();
      const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(updatedFileList);
      dispatch(setProfilePicture(null));
      message.success("Image deleted successfully");
    } catch (error) {
      setFileList([]);
      message.error("Failed to delete image");
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        accept="image/*"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleDelete}
        showUploadList={{ showRemoveIcon: true }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
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
    </>
  );
};

export default ImageUploader;
