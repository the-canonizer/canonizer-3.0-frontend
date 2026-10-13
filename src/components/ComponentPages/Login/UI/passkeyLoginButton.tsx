import { useEffect, useState } from "react";
import { KeyOutlined } from "@ant-design/icons";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

import messages from "src/messages";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

const PasskeyLoginButton = ({ onClick, disabled = false }: Props) => {
  // Feature-detect on the client only to keep SSR markup stable
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(browserSupportsWebAuthn());
  }, []);

  if (!isSupported) return null;

  return (
    <SecondaryButton
      htmlType="button"
      className="h-[40px] text-sm rounded-lg !w-8/12 lg:!w-4/12 mt-6 flex justify-center items-center gap-2"
      onClick={onClick}
      id="login-passkey-btn"
      data-testid="passkey-login-btn"
      disabled={disabled}
    >
      <KeyOutlined aria-hidden="true" /> {messages.passkey.signIn}
    </SecondaryButton>
  );
};

export default PasskeyLoginButton;
