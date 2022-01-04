import Registration from "../components/componentPages/registration";
import GetStartedLayout from "../hoc/getStartedLayout";
const RegistrationPage = () => {
  return (
    <GetStartedLayout routeName={"registration"}>
      <Registration />
    </GetStartedLayout>
  );
};

export default RegistrationPage;
