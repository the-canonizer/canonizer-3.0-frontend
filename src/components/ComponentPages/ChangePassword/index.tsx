import ChangePasswordUI from "./UI";
const ChangePassword = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <ChangePasswordUI
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}></ChangePasswordUI>
  );
};

export default ChangePassword;
