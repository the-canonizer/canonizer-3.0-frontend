import Layout from "src/hoc/layout";
import PreferedTopics from "components/ComponentPages/Home/PreferedTopic";

const RegistrationUserPreferences = () => {
  return (
    <Layout className="bg-canGrey1 min-h-screen">
      <PreferedTopics />
    </Layout>
  );
};

RegistrationUserPreferences.displayName = "RegistrationPage";

export default RegistrationUserPreferences;
