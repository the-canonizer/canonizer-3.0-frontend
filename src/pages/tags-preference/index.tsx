import Layout from "src/hoc/layout";
import Preferences from "src/components/ComponentPages/CategoryPreferences";

const RegistrationUserPreferences = () => {
  return (
    <Layout className="bg-canGrey1 min-h-screen">
      <Preferences />
    </Layout>
  );
};

RegistrationUserPreferences.displayName = "RegistrationPage";

export default RegistrationUserPreferences;
