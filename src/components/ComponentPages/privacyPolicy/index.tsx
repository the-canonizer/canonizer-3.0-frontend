import React, { useEffect, useState } from "react";

import {
  Form,
  Button,
  Checkbox,
  Row,
  Col,
  Card,
  Spin,
  Typography,
  Input,
  Select,
} from "antd";
import { useRouter } from "next/router";
import { getTermsAndServicesContent } from "src/network/api/termsAndPrivacyApi";

export default function PrivacyPolicys({ termsAndServicesConrent }) {
  const [screenLoading, setScreenLoading] = useState(false);

  return (
    <>
      <Spin spinning={screenLoading} size="large">
        <div
          dangerouslySetInnerHTML={{
            __html: termsAndServicesConrent[0]?.privacy_policy_content,
          }}
        />
      </Spin>
    </>
  );
}
