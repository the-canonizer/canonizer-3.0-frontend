import AboutUs from "../components/ComponentPages/AboutUs";
import LoggedOutLayout from "../hoc/loggedOutLayout";
const AboutUsPage = () => {
  const meta = {
    title: "About Canonizer",
    description: "Short description ",
    route: "about",
  };

  return (
    <>
      <LoggedOutLayout meta={meta}>
        <AboutUs />
      </LoggedOutLayout>
    </>
  );
};

export default AboutUsPage;
