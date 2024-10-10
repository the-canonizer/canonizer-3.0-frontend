import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";

function RegistrationUiGoBack({ onBrowseClick }) {
  return (
    <Button
      type="link"
      className="h-[50px] text-sm w-2/12 text-canBlack flex items-center justify-start text-sm font-medium p-0 mb-4 lg:hidden self-start"
      onClick={onBrowseClick}
    >
      <LeftOutlined /> Go Back
    </Button>
  );
}

export default RegistrationUiGoBack;
