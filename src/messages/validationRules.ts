import { patterns, validations } from "./validation";
import { emojiValidation, allowedEmojies } from "../utils/generalUtility";

export const formValidationTypes = () => {
  return ["onSubmit", "onBlur"];
};

export const phoneNumberRule = {
  rules: [
    // {
    //   required: true,
    //   message: validations.phoneNumber,
    // },
    {
      min: 10,
      message: validations.phoneMinLength,
    },
    {
      max: 10,
      message: validations.phoneMaxLength,
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const carrierVal = getFieldValue("mobile_carrier");
        if (carrierVal && !value) {
          return Promise.reject(new Error(validations.phoneNumber));
        }
      },
    }),
  ],
};

export const mobileCarrierRule = {
  rules: [
    // {
    //   required: true,
    //   message: validations.mobileCarrier,
    // },
    ({ getFieldValue }) => ({
      validator(_, value) {
        const phoneVal = getFieldValue("phone_number");
        if (phoneVal && !value) {
          return Promise.reject(new Error(validations.mobileCarrier));
        }
      },
    }),
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
    emojiValidation(patterns.emoji_restrication),
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
    emojiValidation(patterns.emoji_restrication),
  ],
};

export const middleNameRule = {
  rules: [
    {
      max: 100,
      message: validations.firstNameMax,
    },
    emojiValidation(patterns.emoji_restrication),
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
    {
      min: 6,
      message: validations.otpLength,
    },
  ],
};

export const phoneRule = {
  rules: [
    // {
    //   required: true,
    //   message: validations.phone,
    // },
    {
      min: 10,
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
      pattern: patterns.reg_email,
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
    () => ({
      validator(_, value) {
        if (value && value?.trim().match(patterns.emailPhone)) {
          return Promise.resolve();
        } else if (
          value &&
          value.length > 0 &&
          !value?.trim().match(patterns.emailPhone)
        ) {
          return Promise.reject(new Error(validations.usernameNotValid));
        }
        return Promise.reject(new Error());
      },
    }),
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
    () => ({
      validator(_, value) {
        if (!value || value.trim().length > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(validations.nickNameSpaceError));
      },
    }),
    {
      max: 50,
      message: validations.nickNameMax,
    },
  ],
};

// create topic
export const nickNmRule = {
  rules: [
    {
      required: true,
      message: validations.nickNm,
    },
  ],
};

export const topicNameRule = {
  rules: [
    {
      required: true,
      message: validations.topicName,
    },
    {
      max: 30,
      message: validations.topiNameMax30,
    },
    {
      pattern: /[^ \s]/,
      message: "Enter a valid Topic Name",
    },
    emojiValidation(patterns.emoji_restrication),
  ],
};

export const namespaceRule = {
  rules: [
    {
      required: true,
      message: validations.namespace,
    },
  ],
};

export const summaryRule = {
  rules: [
    {
      max: 500,
      message: validations.summaryMax,
    },
    allowedEmojies(),
  ],
};

// create new camp
export const campNameRule = {
  rules: [
    {
      required: true,
      message: validations.campName,
    },
    {
      max: 30,
      message: validations.topiNameMax30,
    },
    emojiValidation(patterns.emoji_restrication),
  ],
};

export const parentCampRule = {
  rules: [
    {
      required: true,
      message: validations.parentCamp,
    },
  ],
};

export const campAboutUrlRule = {
  rules: [
    {
      pattern: patterns.url,
      message: validations.campUrl,
    },
    {
      max: 1024,
      message: validations.campUrlLim,
    },
  ],
};

export const threadTitleRule = {
  rules: [
    {
      required: true,
      message: validations.threadReq,
    },
    {
      max: 100,
      message: validations.Max100,
    },
    emojiValidation(patterns.emoji_restrication),
  ],
};

export const keywordsRule = {
  rules: [emojiValidation(patterns.emoji_restrication)],
};

export const removedReasonSelectRule = {
  rules: [
    {
      required: false,
      message: validations.reason,
    },
  ],
};

export const removedReasonRule = {
  rules: [
    {
      required: true,
      message: validations.reason,
    },
    () => ({
      validator(_, value) {
        if (!value || value.trim().length > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(validations.reason));
      },
    }),
    {
      max: 500,
      message: validations.summaryMax,
    },
    emojiValidation(patterns.emoji_restrication),
  ],
};

export const removedURLRule = {
  rules: [
    {
      pattern: patterns.url,
      message: validations.site_url,
    },
    {
      max: 255,
      message: validations.UrlLim,
    },
  ],
};
