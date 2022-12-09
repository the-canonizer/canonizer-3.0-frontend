import Layout from "../../hoc/layout";
import React from "react";
import CanonVideos from "@/components/ComponentPages/canonVideos";

function VideosPage() {
  return (
    <Layout>
      <CanonVideos />
    </Layout>
  );
}
VideosPage.displayName = "VideosPage";

export default VideosPage;
