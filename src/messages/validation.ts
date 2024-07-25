interface ErrorContainer {
  [key: string]: string;
}

export const patterns = {
  emailPhone:
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  reg_email:
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  email:
    /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/,
  // eslint-disable-next-line no-useless-escape
  allowed_chars: /^[a-zA-Z0-9 !@#$'*+=?^_'"\[\]{|}()~-]*$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*]).{8,}$/,
  alphaSpace: /^[a-zA-Z ]*$/,
  alphaNumSpace: /^[a-zA-Z0-9 ]*$/,
  // eslint-disable-next-line no-useless-escape
  url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  emoji_restrication:
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
};

export const validations: ErrorContainer = {
  username: "Please input your Email!",
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
  validEmail: "Please enter a valid email address.",
  emailMax: "E-mail should be max 255 characters long!",
  captcha: "Please check the captcha!",
  captchaExtra: "We must make sure that your are a human.",
  registrationPassword: "Please input your password!",
  passwordMinLength: "Password must be at least 8 characters long!",
  passwordPattern:
    "Password must contain small, capital letter, number and special character like Abc@1234.",
  confirmPassword: "Please confirm your password!",
  confirmPasswordErr: "Confirm Password does not match!",
  otp: "Please input your OTP!",
  otpLength: "OTP should be min/max 6 characters long!",
  phoneNumber: "Please Enter Phone Number!",
  mobileCarrier: "Please Select Mobile Carrier!",
  dob: "Please select DOB!",
  currentpassword: "Please enter current password!",
  newPassword: "Please enter new password!",
  confirmNewPassword: "Please confirm your password!",
  confirmNewPasswordErr: "Confirm Password does not match.",
  nickName: "Please Enter Nickname!",
  nickNameMax: "Maximum 50 character allowed!",
  nickNameSpaceError: "Please Enter valid Nickname!",
  firstNameSpace: "The first name should only contain alphabets and spaces.",
  lastNameSpace: "The last name should only contain alphabets and spaces.",
  alphaSpace: "The field must be in alphabets and space only.",
  otpMsgs: "Note : OTP has been sent to your registered email address.",
  nickNm: "Please select nickname!",
  topicName: "Please enter topic name!",
  topiNameMax30: "Maximum 30 character allowed!",
  topicNameSpace:
    "Topic name can only contain space and alphanumeric characters.",
  namespace: "Please select Canon!",
  summaryMax: "Maximum 500 character allowed!",
  campName: "Please enter camp name!",
  parentCamp: "Please select parent camp!",
  keywords: "Please enter keywords!",
  campUrlLim: "Maximum 1024 character allowed!",
  UrlLim: "Maximum 255 character allowed!",
  campUrl:
    "The camp about url format is invalid. (Example: https://www.example.com?post=1234)",
  campAlpha: "Camp name can only contain space and alphanumeric characters.",
  threadReq: "Please enter title!",
  threadAlpha: "Title can only contain space and alphanumeric characters.",
  Max100: "Maximum 100 character allowed!",
  reply: " The reply field is required.",
  custom_label: "%&<>,.\\/ are not allowed!",
  not_allowed: "Emojis not allowed!",
  reason: "Summary is required!",
  site_url:
    "URL format is invalid. (Example: https://www.example.com?post=1234)",
};
