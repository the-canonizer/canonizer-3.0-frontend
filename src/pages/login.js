import GetStartedLayout from "../hoc/getStartedLayout";
const LoginPage = () => {
  const meta = {
    title: "login",
    description: "login canonizer ",
    route: "login",
  };

  return (
    <GetStartedLayout meta={meta}>
      <h1>Login Page</h1>
    </GetStartedLayout>
  );
};

export default LoginPage;
