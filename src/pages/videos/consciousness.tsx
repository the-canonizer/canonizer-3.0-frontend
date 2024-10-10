import React from "react";

import Layout from "src/hoc/layout";
import CanonVideos from "src/components/ComponentPages/canonVideos";

function VideosPage() {
  return (
    <Layout>
      <CanonVideos />
    </Layout>
  );
}

VideosPage.displayName = "VideosPage";

export default VideosPage;
