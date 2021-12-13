import AboutUs from "../components/pages/aboutUs";
import Layout from "../hoc/staticLayout";
const AboutUsPage = () => {
  const meta = {
    title: "About Canonizer",
    description: "Short description ",
    route: "about",
  };

  return (
    <>
      <Layout meta={meta}>
        <AboutUs />
      </Layout>
    </>
  );
};

export default AboutUsPage;
