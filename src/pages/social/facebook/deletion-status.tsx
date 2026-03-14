import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";
import WelcomeContent from "components/ComponentPages/Home/WelcomeArea";
import { facebookAccountDeletionStatus } from "src/network/api/userApi";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

const FacebookDeletionStatus: React.FC = () => {
  const router = useRouter();

  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const confirmationCode = router?.query?.confirmation_code || "";

  useEffect(() => {
    const fetchDeletionStatus = async () => {
      try {
        const res = await facebookAccountDeletionStatus(
          confirmationCode as string
        );

        setStatus(res.message);
      } catch (err) {
        setError("Failed to fetch deletion status");
      } finally {
        setLoading(false);
      }
    };

    fetchDeletionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (status) {
      return status;
    }

    return "Please wait while we fetch your account deletion status.";
  };

  return (
    <Layout afterHeader={<WelcomeContent />}>
      <div className="bg-blue-100 p-4 rounded-md shadow-md mb-4 text-center gap-2 grid justify-center items-center">
        {error ? (
          <CloseCircleFilled className="text-red-500 text-3xl grid justify-center items-center" />
        ) : (
          <CheckCircleFilled className="text-green-500 text-3xl grid justify-center items-center" />
        )}
        <h2 className="text-xl font-semibold text-blue-800">
          Account Deletion Status
        </h2>
        <p className="text-blue-700 flex gap-2 justify-center">
          Status: {getContent()}
        </p>
        <p className="text-blue-700">Code: {confirmationCode}</p>
      </div>
    </Layout>
  );
};

FacebookDeletionStatus.displayName = "FacebookDeletionStatus";

export default FacebookDeletionStatus;
