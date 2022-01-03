import AboutUs from "../components/ComponentPages/AboutUs";
import Layout from "../hoc/layout";

const AboutUsPage = () => {
  return (
    <>
      <Layout routeName={"about-us"}>
        <AboutUs />
      </Layout>
    </>
  );
};

export default AboutUsPage;
