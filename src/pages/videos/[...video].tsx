import CanonVideos from "components/ComponentPages/canonVideos";
import React from "react";

import Layout from "src/hoc/layout";

function Video() {
  return (
    <Layout>
      <CanonVideos />
    </Layout>
  );
}

Video.displayName = "VideosPage";
export default Video;
