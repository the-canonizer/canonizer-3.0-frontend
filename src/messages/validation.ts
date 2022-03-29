interface ErrorContainer {
  [key: string]: string;
}

export const patterns = {
  emailPhone: /^([0-9]{9})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$/,
  email:
    /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).{8,}$/,
  alphaSpace: /^[a-zA-Z ]*$/,
  alphaNumSpace: /^[a-zA-Z0-9 ]*$/,
  url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
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
  phoneMinLength: "Phone number must be at least 10 digits!",
  phoneMaxLength: "Phone number must be at least 10 digits!",
  validPhone: "Please input valid phone number!",
  email: "Please input your E-mail!",
  validEmail: "The input is not valid E-mail!",
  emailMax: "E-mail should be max 255 characters long!",
  captcha: "Please check the captcha!",
  captchaExtra: "We must make sure that your are a human.",
  registrationPassword: "Please input your password!",
  passwordMinLength: "Password must be at least 8 characters long!",
  passwordPattern:
    "Password must be contain small, capital letter, number and special character like Abc@1234.",
  confirmPassword: "Please confirm your password!",
  confirmPasswordErr: "Confirm Password does not match!",
  otp: "Please input your OTP!",
  otpLength: "OTP should be min/max 6 characters long!",
  phoneNumber: "Please Enter Phone Number!",
  mobileCarrier: "Please Enter Mobile Carrier!",
  dob: "Please select DOB!",
  currentpassword: "Please enter current password!",
  newPassword: "Please enter new password!",
  confirmNewPassword: "Please confirm your password!",
  confirmNewPasswordErr: "Confirm Password does not match.",
  nickName: "Please Enter Nick Name!",
  nickNameMax: "Maximum 50 character allowed!",
  nickNameSpaceError: "Please Enter valid Nick Name!",
  firstNameSpace: "The first name should only contain alphabets and spaces.",
  lastNameSpace: "The first name should only contain alphabets and spaces.",
  alphaSpace: "The field must be in alphabets and space only.",
  otpMsgs:
    " Note : OTP has been sent to your registered email address and phone number.",
  nickNm: "Please select nick name!",
  topicName: "Please enter topic name!",
  topiNameMax30: "Maximum 30 character allowed!",
  topicNameSpace:
    "Topic name can only contain space and alphanumeric characters.",
  namespace: "Please select Namespace!",
  summaryMax: "Maximum 500 character allowed!",
  campName: "Please enter camp name!",
  parentCamp: "Please select parent camp!",
  keywords: "Please enter keywords!",
  campUrlLim: "Maximum 1024 character allowed!",
  campUrl: "The camp about url format is invalid.",
  campAlpha: "Camp name can only contain space and alphanumeric characters.",
};
