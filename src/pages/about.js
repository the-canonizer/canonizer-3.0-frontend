import Layout from "../hoc/staticLayout";
const AboutUs = () => {
  const meta = {
    title: "About Canonizer",
    description: "Short description ",
    route: "about",
  };

  return (
    <>
      <Layout meta={meta}>
        <h1>About us</h1>
      </Layout>
    </>
  );
};

export default AboutUs;
