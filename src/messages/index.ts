import { labels } from "./label";
import { placeholders } from "./placeholder";
import { patterns, validations } from "./validation";
import * as rules from "./validationRules";

const messages = {
  labels,
  patterns,
  placeholders,
  validations,
  ...rules,
};

export default messages;
