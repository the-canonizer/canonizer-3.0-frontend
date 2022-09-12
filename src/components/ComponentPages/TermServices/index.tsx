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

export default function TermsService({ termsAndServicesConrent }) {
  const [screenLoading, setScreenLoading] = useState(false);

  return (
    <>
      <Spin spinning={screenLoading} size="large">
        <div
          dangerouslySetInnerHTML={{
            __html: termsAndServicesConrent[0]?.terms_and_services_content,
          }}
        />
      </Spin>
    </>
  );
}
