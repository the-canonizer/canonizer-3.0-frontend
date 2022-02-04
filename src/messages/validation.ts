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
  firstNameMax: "Maximum 100 character allow!",
  middleName: "Please input your middle name!",
  lastName: "Please input your last name!",
  phone: "Please input your phone number!",
  phoneLength: "Phone number should be min 9 to max 10 characters long!",
  email: "Please input your E-mail!",
  validEmail: "The input is not valid E-mail!",
  captcha: "Please input the captcha you got!",
  captchaExtra: "We must make sure that your are a human.",
  registrationPassword: "Please input your password!",
  passwordMinLength: "Password must be at least 8 characters long!",
  passwordPattern: "Password Should be like Abc@1234.",
  confirmPassword: "Please confirm your password!",
  confirmPasswordErr: "The two passwords that you entered do not match!",
  otp: "Please input your otp!",
  otpLength: "OTP should be min/max 6 characters long!",
  phoneNumber: "Please Enter Phone Number!",
  mobileCarrier: "Please Enter Mobile Carrier!",
  dob: "Please select DOB!",
};

export const phoneNumberRule = {
  rules: [
    {
      required: true,
      message: validations.phoneNumber,
    },
  ],
};
export const mobileCarrierRule = {
  rules: [
    {
      required: true,
      message: validations.mobileCarrier,
    },
  ],
};
export const firstNameRule = {
  rules: [
    {
      required: true,
      message: validations.firstName,
    },
    {
      max: 100,
      message: validations.firstNameMax,
    },
  ],
};
export const lastNameRule = {
  rules: [
    {
      required: true,
      message: validations.lastName,
    },
    {
      max: 100,
      message: validations.firstNameMax,
    },
  ],
};
export const middleNameRule = {
  rules: [
    {
      max: 100,
      message: validations.middleName,
    },
  ],
};
export const emailRule = {
  rules: [
    {
      type: "email",
      message: validations.email,
    },
    {
      required: true,
      message: validations.email,
    },
    {
      pattern: patterns.email,
      message: validations.validEmail,
    },
  ],
};

export const dobRule = {
  rules: [
    {
      type: "object",
      message: validations.dob,
    },
    { required: true, message: validations.dob },
  ],
};

export const otpRule = {
  rules: [
    {
      required: true,
      message: validations.otp,
    },
    {
      max: 6,
      message: validations.otpLength,
    },
  ],
};

export const phoneRule = {
  rules: [
    {
      required: false,
      message: validations.phone,
    },
    {
      min: 9,
      message: validations.phoneLength,
    },
    {
      max: 10,
      message: validations.phoneLength,
    },
  ],
};

export const getCaptchaRule = (showCaptchaError) => {
  return {
    rules: [
      () => ({
        validator() {
          if (showCaptchaError) {
            return Promise.resolve();
          }
          return Promise.reject(new Error(validations.captcha));
        },
      }),
    ],
  };
};

export const emRule = {
  rules: [
    {
      max: 255,
      message: validations.middleName,
    },
    {
      required: true,
      message: validations.email,
    },
    {
      pattern: patterns.email,
      message: validations.validEmail,
    },
  ],
};

export const passwordRule = {
  rules: [
    {
      required: true,
      message: validations.registrationPassword,
    },
    {
      min: 5,
      message: validations.passwordMinLength,
    },
    {
      pattern: patterns.password,
      message: validations.passwordPattern,
    },
  ],
};

export const confirmPasswordRule = {
  rules: [
    {
      required: true,
      message: validations.confirmPassword,
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(validations.confirmPasswordErr));
      },
    }),
  ],
};

export const usernameRule = {
  rules: [
    {
      required: true,
      message: validations.username,
    },
    {
      pattern: patterns.emailPhone,
      message: validations.usernameNotValid,
    },
  ],
};

export const userPassRule = {
  rules: [{ required: true, message: validations.password }],
};
