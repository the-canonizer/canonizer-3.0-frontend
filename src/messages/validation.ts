interface ErrorContainer {
  [key: string]: string;
}

export const patterns = {
  emailPhone: /^([0-9]{9})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/,
  email:
    /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).{8,}$/,
};

export const validations: ErrorContainer = {
  username: "Please input your Email / Phone Number!",
  usernameNotValid: "Input is not valid!",
  password: "Please input your Password!",
  firstName: "Please input your first name!",
  firstNameMax: "More than 100 characters are not allowed!",
  middleName: "Please input your middle name!",
  lastName: "Please input your last name!",
  phone: "Please input your phone number!",
  phoneMinLength: "'Phone Number' must be at least 9 digits",
  phoneMaxLength: "'Phone Number' should be max 10 digits",
  validPhone: "Please input valid phone number!",
  email: "Please input your E-mail!",
  validEmail: "The input is not valid E-mail!",
  emailMax: "E-mail should be max 255 characters long!",
  captcha: "Please input the captcha you got!",
  captchaExtra: "We must make sure that your are a human.",
  registrationPassword: "Please input your password!",
  passwordMinLength: "Password must be at least 8 characters long!",
  passwordPattern:
    "Password must be contain small, capital letter, number and special character like Abc@1234.",
  confirmPassword: "Please confirm your password!",
  confirmPasswordErr: "The two passwords that you entered do not match!",
  otp: "Please input your otp!",
  otpLength: "OTP should be min/max 6 characters long!",
  phoneNumber: "Please Enter Phone Number!",
  mobileCarrier: "Please Enter Mobile Carrier!",
  dob: "Please select DOB!",
  currentpassword: "Please enter current password!",
  newPassword: "Please enter new password!",
  confirmNewPassword: "Please confirm your password!",
  confirmNewPasswordErr: "The confirm password and new password must match",
  nickName: "Please Enter Nick Name!",
  nickNameMax: "Maximum 50 character allowed!",
};
