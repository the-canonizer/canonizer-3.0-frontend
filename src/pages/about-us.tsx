import AboutUs from "../components/ComponentPages/aboutUs";
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
