import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

import styles from "./PageLoadingIndicator.module.scss";

const PageLoadingIndicator: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={styles.pageLoadingOverlay}
      data-testid="page-loading-indicator"
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default PageLoadingIndicator;
