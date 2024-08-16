import { Form, Input, Button, Row, Col } from "antd";
import styles from "./ChangePassword.module.scss";
import messages from "../../../../messages";
import { useState } from "react";
import Image from "next/image";

export default function ChangePasswordUI({
  form,
  onFinish,
  onFinishFailed,
  incorrectPasswordData,
  setIncorrectPasswordData,
}: any) {
  const [currentPassWord, setCurrentPassWord] = useState("");
  const validateFun = {
    validateStatus: "error" as any,
    help: incorrectPasswordData as any,
  };
  const onChangeFun = (value) => {
    setCurrentPassWord(value);
    setIncorrectPasswordData("");
  };
  return (
    <>
      <section className={styles.change_password}>
        <h3 className="mb-5 uppercase text-canBlack font-semibold text-base">
          Change Password
        </h3>
        <Form
          form={form}
          name="changePassword"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="p-0"
        >
          <div className={styles.section_one}>
            <Row gutter={30}>
              <Col md={12}>
                <Form.Item
                  className="[&_.ant-input-affix-wrapper]:!border-canGrey2"
                  name="current_password"
                  label={
                    <>
                      {messages.labels.currentPassword}
                      <span className="required" id="asteriskCurrentPassword">
                        *
                      </span>
                    </>
                  }
                  {...messages.currentPasswordRule}
                  {...(currentPassWord !== ""
                    ? incorrectPasswordData
                      ? validateFun
                      : ""
                    : "")}
                >
                  <Input
                    className="rounded-lg pl-5 pr-5"
                    prefix={
                      <Image
                        src="/images/nickname-lock-icon.svg"
                        width={14}
                        height={16}
                        alt=""
                      />
                    }
                    suffix={
                      <Image
                        src="/images/visible-icon.svg"
                        width={16}
                        height={13}
                        alt=""
                      />
                    }
                    id="currentPassword"
                    type="password"
                    data-testid="currentpasssword"
                    // placeholder={messages.placeholders.currentPassword}
                    onChange={(e) => onChangeFun(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === " " && e.keyCode === 32 && e.preventDefault()
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="mt-12">
              <h3 className="mb-5 uppercase text-canBlack font-semibold text-base">
                Enter New Password
              </h3>
            </div>
            <Row gutter={30}>
              <Col md={8}>
                <Form.Item
                  className="[&_.ant-input-affix-wrapper]:!border-canGrey2"
                  name="new_password"
                  label={
                    <>
                      {messages.labels.newPassword}
                      <span className="required" id="asteriskNewPassword">
                        *
                      </span>
                    </>
                  }
                  {...messages.newPasswordRule}
                  //hasFeedback
                >
                  <Input
                    className="rounded-lg pl-5 pr-5"
                    prefix={
                      <Image
                        src="/images/nickname-lock-icon.svg"
                        width={14}
                        height={16}
                        alt=""
                      />
                    }
                    suffix={
                      <Image
                        src="/images/visible-icon.svg"
                        width={16}
                        height={13}
                        alt=""
                      />
                    }
                    id="newPassword"
                    //className={styles.Password_input}
                    type="password"
                    data-testid="newpassword"
                    // placeholder={messages.placeholders.newPassword}
                    onKeyDown={(e) =>
                      e.key === " " && e.keyCode === 32 && e.preventDefault()
                    }
                  />
                </Form.Item>
              </Col>
              <Col md={8}>
                {" "}
                <Form.Item
                  className="[&_.ant-input-affix-wrapper]:!border-canGrey2"
                  name="confirm_password"
                  label={
                    <>
                      {messages.labels.confirmPassword}
                      <span className="required" id="asteriskConfirmPassword">
                        *
                      </span>
                    </>
                  }
                  dependencies={["new_password"]}
                  //hasFeedback
                  {...messages.confirmNewPasswordRule}
                >
                  <Input
                    className="rounded-lg pl-5 pr-5"
                    prefix={
                      <Image
                        src="/images/nickname-lock-icon.svg"
                        width={14}
                        height={16}
                        alt=""
                      />
                    }
                    suffix={
                      <Image
                        src="/images/visible-icon.svg"
                        width={16}
                        height={13}
                        alt=""
                      />
                    }
                    id="confirmPassword"
                    data-testid="confirmpassword"
                    type="password"
                    // placeholder={messages.placeholders.confirmPassword}
                    onKeyDown={(e) =>
                      e.key === " " && e.keyCode === 32 && e.preventDefault()
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Form.Item>
            {/* <Button
              id="saveBtn"
              type="primary"
              htmlType="submit"
              data-testid="submitButton"
              className="Profile_btn"
            >
              Save
            </Button> */}
            <div className="flex items-center w-full justify-center gap-6">
              <Button
                className="ant-btn-lg py-2.5 px-12 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-[#98B7E6] bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue justify-center "
                onClick={() => {
                  form.resetFields(); // Reset all fields in the form
                  setCurrentPassWord(""); // Optionally clear the state if needed
                  setIncorrectPasswordData(""); // Clear any incorrect password error message
                }}
              >
                Discard{" "}
                <Image
                  src="/images/cross-dark.svg"
                  width={16}
                  height={16}
                  alt="no image"
                />
              </Button>
              <Button
                id="profileUpdate"
                type="primary"
                htmlType="submit"
                data-testid="submitButton"
                tabIndex={12}
                className="  ant-btn-lg py-2.5 px-6 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center"
              >
                Save Changes{" "}
                <Image
                  src="/images/save-icon.svg"
                  width={24}
                  height={24}
                  alt="no image"
                />
              </Button>
            </div>
          </Form.Item>
        </Form>
      </section>
    </>
  );
}
