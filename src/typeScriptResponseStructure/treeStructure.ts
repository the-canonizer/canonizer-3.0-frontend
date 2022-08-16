// import Joi from "joi";
export interface Node {
  topic_id: number;
  camp_id: number;
  title: number;
  review_title: string;
  link: string;
  review_link: string;
  score: number;
  submitter_nick_id: number;
  children: [Node];
}

export interface TreeStructure {
  [key: string]: Node;
}

// export const schema = {
//   type: "object",
//   properties: {
//     topic_id: { type: "integer" },
//     camp_id: { type: "integer" },
//     title: { type: "integer" },
//     review_title: { type: "integer" },
//     link: { type: "integer" },
//     review_link: { type: "integer" },
//     score: { type: "string" },
//     submitter_nick_id: { type: "integer" },
//     // children: [Node];
//   },
//   additionalProperties: false,
//   // type: "object",
//   // properties: {
//   //   foo: { type: "integer" },
//   //   bar: { type: "string" },
//   // },
//   // required: ["foo"],
//   // additionalProperties: false,
// };

// export const TreeStructureSchema = Joi.object({
//   "1": Joi.object({
//     topic_id: Joi.number().required(),
//     camp_id: Joi.number().required(),
//     title: Joi.number().required(),
//     review_title: Joi.string().required(),
//     link: Joi.string().required(),
//     review_link: Joi.string().required(),
//     score: Joi.number().required(),
//     submitter_nick_id: Joi.number().required(),
//     children: Joi.object().allow(null),
//   }),
// }).unknown(true);
