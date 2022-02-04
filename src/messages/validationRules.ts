import { patterns, validations } from "./validation";

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
  ]
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
  ]
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
  ]
};
export const middleNameRule = {
  rules: [
    {
      max: 100,
      message: validations.middleName,
    },
  ]
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
    }
  ]
};
export const dobRule = {
  rules: [
    {
      required: true,
      message: validations.dob,
    },
  ]
};