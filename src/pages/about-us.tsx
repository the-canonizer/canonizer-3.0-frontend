import AboutUs from "../components/ComponentPages/AboutUs";
import LoggedOutLayout from "../hoc/loggedOutLayout";

const AboutUsPage = () => {
  return (
    <>
      <LoggedOutLayout routeName={"about-us"}>
        <AboutUs />
      </LoggedOutLayout>
    </>
  );
};

export default AboutUsPage;
