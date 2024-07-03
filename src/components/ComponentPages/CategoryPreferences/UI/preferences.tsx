import { Typography, Card, Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

import PrimaryButton from "src/components/shared/Buttons/PrimariButton";
import CustomCheckbox from "src/components/shared/FormInputs/checkbox";

const { Title } = Typography;

const isDisabled = (data) => data?.some((d) => d?.checked);

export default function PreferencesUI({ onChange, tags, onFinish, onSkip }) {
  return (
    <Card className="rounded-lg w-8/12 m-auto lg:w-full" bordered={false}>
      <div className="flex justify-center items-center text-center flex-col mb-4 relative">
        <Title
          level={4}
          className="mt-4 text-sm text-canBlack font-medium"
          id="registration-title"
        >
          Select your preferred categories
        </Title>
        <Button
          type="link"
          className="text-canBlack text-sm opacity-50 absolute right-0 top-0 hocus:blue hocus:opacity-100 md:hidden"
          onClick={onSkip}
        >
          Skip
        </Button>
      </div>
      <div className="w-full text-center my-4 max-h-80 overflow-y-auto overflow-x-hidden px-1 overscroll-auto focus:overscroll-contain">
        {tags?.map((ch) => (
          <CustomCheckbox
            id={ch?.id}
            key={ch?.id}
            onChange={onChange?.bind(this, ch)}
            checked={ch?.checked}
            className="my-1"
          >
            {ch?.title}
          </CustomCheckbox>
        ))}
      </div>

      <PrimaryButton
        type="primary"
        htmlType="button"
        className="h-[40px] text-sm rounded-md !w-4/12 m-auto flex justify-center items-center sm:!w-full"
        block
        data-testid="submitButton"
        id="otp-btn"
        disabled={!isDisabled(tags)}
        onClick={onFinish}
      >
        Get Started <ArrowRightOutlined />
      </PrimaryButton>
      <Button
        type="link"
        className="text-canBlack text-sm opacity-50 absolute right-0 top-0 hocus:blue hocus:opacity-100 hidden md:block"
        onClick={onSkip}
      >
        Skip
      </Button>
    </Card>
  );
}
