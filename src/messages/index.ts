import { labels, preventCampLabel } from "./label";
import { passkey } from "./passkey";
import { placeholders } from "./placeholder";
import { patterns, validations } from "./validation";
import * as rules from "./validationRules";

const messages = {
  labels,
  patterns,
  placeholders,
  validations,
  ...rules,
  preventCampLabel,
  passkey,
};

export default messages;
