import { patterns, validations } from "./validation";

export const phoneNumberRule = {
  rules: [
    {
      required: true,
      message: validations.phoneNumber,
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
      message: validations.firstNameMax,
    },
  ],
};
export const emailRule = {
  rules: [
    {
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
      required: true,
      message: validations.dob,
    },
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
      min: 9,
      message: validations.phoneMinLength,
    },
    {
      max: 10,
      message: validations.phoneMaxLength,
    },
    () => ({
      validator(_, value) {
        if (value && value !== "") {
          let number = +value;
          if (isNaN(number)) {
            return Promise.reject(new Error(validations.validPhone));
          }
        }
        return Promise.resolve();
      },
    }),
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
      message: validations.emailMax,
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

export const currentPasswordRule = {
  rules: [
    {
      required: true,
      message: validations.currentpassword,
    },
  ],
};
export const newPasswordRule = {
  rules: [
    {
      required: true,
      message: validations.newPassword,
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

export const confirmNewPasswordRule = {
  rules: [
    {
      required: true,
      message: validations.confirmNewPassword,
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("new_password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(validations.confirmNewPasswordErr));
      },
    }),
  ],
};

export const nickNameRule = {
  rules: [
    {
      required: true,
      message: validations.nickName,
    },
    {
      max: 50,
      message: validations.nickNameMax,
    },
  ],
};
