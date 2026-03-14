import React from "react";

import Layout from "src/hoc/layout";
import Edit from "components/ComponentPages/News";

const EditNewsPage = () => {
  return (
    <Layout>
      <Edit edit={true} />
    </Layout>
  );
};

EditNewsPage.displayName = "EditNewsPage";

export default EditNewsPage;
