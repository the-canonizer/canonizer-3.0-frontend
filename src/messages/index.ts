import { labels } from "./label";
import { placeholders } from "./placeholder";
import { patterns, validations } from "./validation";
import {  phoneNumberRule,mobileCarrierRule,firstNameRule,lastNameRule,middleNameRule,emailRule,dobRule } from "./validationRules";

const messages = { labels, patterns, placeholders, validations, phoneNumberRule,mobileCarrierRule,firstNameRule,lastNameRule,middleNameRule,emailRule,dobRule };

export default messages;
