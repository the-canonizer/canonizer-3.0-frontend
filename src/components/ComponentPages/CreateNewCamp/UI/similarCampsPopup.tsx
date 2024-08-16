import { List, Modal, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import UserEditIcon from "./userEditIcon";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import { getTopicNameLink } from "./existingCampList";

const SimilarCampPopup = ({
  campName,
  data,
  onContributeCLick,
  isOpen,
  handleCancel,
  onFtContriClick,
  onCreateCamp,
  loading,
}) => {
  return (
    <Modal
      open={isOpen}
      title="Before you create the camp..."
      onCancel={handleCancel}
      centered
      width={700}
      footer={
        <div className="flex justify-center items-start">
          <SecondaryButton
            key="back"
            onClick={onFtContriClick}
            className="flex h-auto shadow-none text-canBlue hocus:text-canBlue hocus:[&_>svg]:fill-canBlue flex justify-center items-center"
          >
            Contribute To Similar Camps{" "}
            <UserEditIcon
              className="[&_>svg]:text-sm ml-2"
              width="18"
              height=""
            />
          </SecondaryButton>
          <PrimaryButton
            key="submit"
            loading={loading}
            onClick={onCreateCamp}
            className="flex justify-center items-center h-auto"
          >
            Continue Creating A New Camp <ArrowRightOutlined />
          </PrimaryButton>
        </div>
      }
      className="[&_.ant-modal-header]:border-0 [&_.ant-modal-footer]:border-0 [&_.ant-modal-footer]:pb-8 [&_.ant-modal-title]:text-canBlack [&_.ant-modal-title]:text-base [&_.ant-modal-close]:text-canBlack [&_.ant-modal-body]:pt-0 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:overflow-hidden"
    >
      <Typography.Paragraph className="text-canLight font-normal text-xs">
        We noticed that there are 3 Camps with similar name. Are you sure you
        want to create a new camp? You can contribute in any of the existing
        camps.
      </Typography.Paragraph>
      <List
        dataSource={data}
        locale={{ emptyText: "There are no related camps available" }}
        className="!list-disc"
        renderItem={(item: {
          id: string;
          link: string;
          type_value: string;
        }) => (
          <List.Item
            className="!border-b-0 mt-0 text-sm !p-3 rounded-lg"
            key={item?.id}
          >
            {getTopicNameLink(item, campName, false, "w-full border-b-2 pb-3")}
            <SecondaryButton
              className="flex p-0 !bg-transparent h-auto shadow-none border-0 uppercase text-xs font-semibold text-canBlue hocus:text-canBlue hocus:[&_>svg]:fill-canBlue"
              onClick={onContributeCLick.bind(this, item)}
            >
              contribute{" "}
              <UserEditIcon
                className="[&_>svg]:text-sm ml-2"
                width="18"
                height=""
              />
            </SecondaryButton>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default SimilarCampPopup;
