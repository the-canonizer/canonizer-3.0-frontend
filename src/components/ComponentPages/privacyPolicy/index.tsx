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

export default function PrivacyPolicys() {
  const [screenLoading, setScreenLoading] = useState(false);
  const [termsData, setTermsData] = useState("");

  useEffect(() => {
    async function nickNameListApiCall() {
      setScreenLoading(true);
      const res = await getTermsAndServicesContent();
      let a = await new Promise((r) => setTimeout(r, 2000));
      setTermsData(res && res[0]?.terms_and_services_content);
      setScreenLoading(false);
    }
    nickNameListApiCall();
  }, []);
  return (
    <>
      <Spin spinning={screenLoading} size="large">
        <div
          dangerouslySetInnerHTML={{
            __html: termsData,
          }}
        />
      </Spin>
    </>
  );
}
