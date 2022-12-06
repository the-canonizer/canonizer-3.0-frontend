import Layout from "../../hoc/layout";
import React, { ReactElement } from "react";
import CanonVideos from "@/components/ComponentPages/canonVideos";

interface Props {}

const VideosPage = ({}: Props): ReactElement => {
  return (
    <Layout>
      <CanonVideos />
    </Layout>
  );
};
VideosPage.displayName = "VideosPage";

export default VideosPage;
