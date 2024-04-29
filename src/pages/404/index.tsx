import Layout from "src/hoc/layout";
import My404 from "src/components/ComponentPages/404";

const My404Page = () => {
  console.log("=====> 404",)
  return (
    <Layout>
      <My404 />
    </Layout>
  );
};

My404Page.displayName = "My404Page";

export default My404Page;
