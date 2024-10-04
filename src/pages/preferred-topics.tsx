import Layout from "src/hoc/layout";
import PreferedTopics from "components/ComponentPages/Home/PreferedTopic";

const RegistrationUserPreferences = () => {
  return (
    <Layout className="min-h-screen">
      <PreferedTopics isPage={true} />
    </Layout>
  );
};

RegistrationUserPreferences.displayName = "RegistrationPage";

export default RegistrationUserPreferences;
