import Registration from "../components/ComponentPages/Registration";
import GetStartedLayout from "../hoc/getStartedLayout";
const RegistrationPage = () => {
  const meta = {
    title: "Registration",
    description: "Register to canonizer ",
    route: "registration",
  };
  return (
    <GetStartedLayout meta={meta}>
      <Registration />
    </GetStartedLayout>
  );
};

export default RegistrationPage;
