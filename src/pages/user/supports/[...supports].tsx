import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "src/hoc/layout";
import UserProfiles from "src/components/ComponentPages/UserProfile";

function UserProfile() {
  const router = useRouter();

  useEffect(() => {
    let queries = router?.query;
    if ("namespace" in queries) {
      const { namespace, ...rest } = queries;
      queries = rest;
      queries.canon = namespace;
      router.query = queries;
      router?.replace(router, null, { shallow: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <UserProfiles />
    </Layout>
  );
}

UserProfile.displayName = "UserProfile";

export default UserProfile;
