import Joi from "joi";
import {
  setTree,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
  pushToCampSupportingTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
  setCurrentTopicRecordSubscriptionId,
  setCurrentCampRecordSubscriptionId,
} from "../../store/slices/campDetailSlice";
import NetworkCall from "../networkCall";
import TreeRequest from "../request/campDetailRequest";
import { message } from "antd";
import { store } from "../../store";
import { handleError, isServer } from "../../utils/generalUtility";
import { TreeStructure } from "src/typeScriptResponseStructure/treeStructure";
// import { TreeStructureSchema } from "src/typeScriptResponseStructure/treeStructure";

export const getTreesApi = async (reqBody) => {
  try {
    const {
      data,
      code,
      success,
    }: { data: TreeStructure[]; code: string; success: number } = {
      data: [
        {
          "1": {
            topic_id: 88,
            camp_id: 1,
            title: "Theories of Consciousness",
            review_title: "Theories of Consciousness",
            link: "/topic/88-Theories-of-Consciousness/1-Agreement",
            review_link: "/topic/88-Theories-of-Consciousness/1-Agreement",
            score: 66.004,
            submitter_nick_id: 1,
            children: {
              "2": {
                topic_id: 88,
                camp_id: 2,
                title: "Approachable Via Science",
                review_title: "Approachable Via Science",
                link: "/topic/88-Theories-of-Consciousness/2-Approachable-Via-Science#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/2-Approachable-Via-Science#statement",
                score: 56.867000000000004,
                submitter_nick_id: 1,
                children: {
                  "6": {
                    topic_id: 88,
                    camp_id: 6,
                    title: "Representational Qualia",
                    review_title: "Representational Qualia",
                    link: "/topic/88-Theories-of-Consciousness/6-Representational-Qualia#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/6-Representational-Qualia#statement",
                    score: 41.959,
                    submitter_nick_id: 116,
                    children: {
                      "17": {
                        topic_id: 88,
                        camp_id: 17,
                        title: "Mind-Brain Identity",
                        review_title: "Mind-Brain Identity",
                        link: "/topic/88-Theories-of-Consciousness/17-Mind-Brain-Identity#statement",
                        review_link:
                          "/topic/88-Theories-of-Consciousness/17-Mind-Brain-Identity#statement",
                        score: 29.880000000000003,
                        submitter_nick_id: 1,
                        children: {
                          "15": {
                            topic_id: 88,
                            camp_id: 15,
                            title: "SCVR",
                            review_title: "SCVR",
                            link: "/topic/88-Theories-of-Consciousness/15-SCVR#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/15-SCVR#statement",
                            score: 0,
                            submitter_nick_id: 35,
                            children: [],
                          },
                          "19": {
                            topic_id: 88,
                            camp_id: 19,
                            title: "Property Dualism",
                            review_title: "Property Dualism",
                            link: "/topic/88-Theories-of-Consciousness/19-Property-Dualism#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/19-Property-Dualism#statement",
                            score: 13.254,
                            submitter_nick_id: 1,
                            children: {
                              "8": {
                                topic_id: 88,
                                camp_id: 8,
                                title: "Functional Prprty Dualism",
                                review_title: "Functional Prprty Dualism",
                                link: "/topic/88-Theories-of-Consciousness/8-Functional-Prprty-Dualism#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/8-Functional-Prprty-Dualism#statement",
                                score: 4,
                                submitter_nick_id: 1,
                                children: {
                                  "9": {
                                    topic_id: 88,
                                    camp_id: 9,
                                    title: "Comp Functionalism",
                                    review_title: "Comp Functionalism",
                                    link: "/topic/88-Theories-of-Consciousness/9-Comp-Functionalism#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/9-Comp-Functionalism#statement",
                                    score: 1,
                                    submitter_nick_id: 1,
                                    children: {
                                      "16": {
                                        topic_id: 88,
                                        camp_id: 16,
                                        title: "quasi-functionalism",
                                        review_title: "quasi-functionalism",
                                        link: "/topic/88-Theories-of-Consciousness/16-quasi-functionalism#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/16-quasi-functionalism#statement",
                                        score: 1,
                                        submitter_nick_id: 111,
                                        children: [],
                                      },
                                    },
                                  },
                                  "10": {
                                    topic_id: 88,
                                    camp_id: 10,
                                    title: "Biological naturalism",
                                    review_title: "Biological naturalism",
                                    link: "/topic/88-Theories-of-Consciousness/10-Biological-naturalism#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/10-Biological-naturalism#statement",
                                    score: 0,
                                    submitter_nick_id: 35,
                                    children: [],
                                  },
                                  "54": {
                                    topic_id: 88,
                                    camp_id: 54,
                                    title: "HST",
                                    review_title: "HST",
                                    link: "/topic/88-Theories-of-Consciousness/54-HST#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/54-HST#statement",
                                    score: 1,
                                    submitter_nick_id: 271,
                                    children: [],
                                  },
                                },
                              },
                              "34": {
                                topic_id: 88,
                                camp_id: 34,
                                title: "Panexperientialism",
                                review_title: "Panexperientialism",
                                link: "/topic/88-Theories-of-Consciousness/34-Panexperientialism#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/34-Panexperientialism#statement",
                                score: 8.004,
                                submitter_nick_id: 1,
                                children: {
                                  "3": {
                                    topic_id: 88,
                                    camp_id: 3,
                                    title: "Absolute space conscious",
                                    review_title: "Absolute space conscious",
                                    link: "/topic/88-Theories-of-Consciousness/3-Absolute-space-conscious#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/3-Absolute-space-conscious#statement",
                                    score: 2.004,
                                    submitter_nick_id: 1,
                                    children: {
                                      "4": {
                                        topic_id: 88,
                                        camp_id: 4,
                                        title: "Consciousness fundamntal",
                                        review_title:
                                          "Consciousness fundamntal",
                                        link: "/topic/88-Theories-of-Consciousness/4-Consciousness-fundamntal#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/4-Consciousness-fundamntal#statement",
                                        score: 1.004,
                                        submitter_nick_id: 38,
                                        children: {
                                          "5": {
                                            topic_id: 88,
                                            camp_id: 5,
                                            title: "Mind is a separate field",
                                            review_title:
                                              "Mind is a separate field",
                                            link: "/topic/88-Theories-of-Consciousness/5-Mind-is-a-separate-field#statement",
                                            review_link:
                                              "/topic/88-Theories-of-Consciousness/5-Mind-is-a-separate-field#statement",
                                            score: 1.004,
                                            submitter_nick_id: 38,
                                            children: [],
                                          },
                                        },
                                      },
                                      "22": {
                                        topic_id: 88,
                                        camp_id: 22,
                                        title: "Spacetime geometry",
                                        review_title: "Spacetime geometry",
                                        link: "/topic/88-Theories-of-Consciousness/22-Spacetime-geometry#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/22-Spacetime-geometry#statement",
                                        score: 0,
                                        submitter_nick_id: 116,
                                        children: [],
                                      },
                                    },
                                  },
                                  "46": {
                                    topic_id: 88,
                                    camp_id: 46,
                                    title: "force of physics",
                                    review_title: "force of physics",
                                    link: "/topic/88-Theories-of-Consciousness/46-force-of-physics#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/46-force-of-physics#statement",
                                    score: 2,
                                    submitter_nick_id: 226,
                                    children: [],
                                  },
                                  "50": {
                                    topic_id: 88,
                                    camp_id: 50,
                                    title: "Multisense Realism",
                                    review_title: "Multisense Realism",
                                    link: "/topic/88-Theories-of-Consciousness/50-Multisense-Realism#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/50-Multisense-Realism#statement",
                                    score: 1,
                                    submitter_nick_id: 261,
                                    children: {
                                      "51": {
                                        topic_id: 88,
                                        camp_id: 51,
                                        title: "Qualitative Present",
                                        review_title: "Qualitative Present",
                                        link: "/topic/88-Theories-of-Consciousness/51-Qualitative-Present#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/51-Qualitative-Present#statement",
                                        score: 0,
                                        submitter_nick_id: 261,
                                        children: [],
                                      },
                                    },
                                  },
                                  "56": {
                                    topic_id: 88,
                                    camp_id: 56,
                                    title: "Holistic Panexperientiali",
                                    review_title: "Holistic Panexperientiali",
                                    link: "/topic/88-Theories-of-Consciousness/56-Holistic-Panexperientiali#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/56-Holistic-Panexperientiali#statement",
                                    score: 0,
                                    submitter_nick_id: 309,
                                    children: [],
                                  },
                                  "61": {
                                    topic_id: 88,
                                    camp_id: 61,
                                    title: "Physicalistic Idealism",
                                    review_title: "Physicalistic Idealism",
                                    link: "/topic/88-Theories-of-Consciousness/61-Physicalistic-Idealism#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/61-Physicalistic-Idealism#statement",
                                    score: 0,
                                    submitter_nick_id: 237,
                                    children: [],
                                  },
                                },
                              },
                              "59": {
                                topic_id: 88,
                                camp_id: 59,
                                title: "Integrated Information",
                                review_title: "Integrated Information",
                                link: "/topic/88-Theories-of-Consciousness/59-Integrated-Information#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/59-Integrated-Information#statement",
                                score: 0.25,
                                submitter_nick_id: 320,
                                children: [],
                              },
                            },
                          },
                          "64": {
                            topic_id: 88,
                            camp_id: 64,
                            title: "Integrated Information Theory",
                            review_title: "Integrated Information Theory",
                            link: "/topic/88-Theories-of-Consciousness/64-Integrated-Information-Theory#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/64-Integrated-Information-Theory#statement",
                            score: 0,
                            submitter_nick_id: 377,
                            children: [],
                          },
                          "65": {
                            topic_id: 88,
                            camp_id: 65,
                            title: "Monism",
                            review_title: "Monism",
                            link: "/topic/88-Theories-of-Consciousness/65-Monism#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/65-Monism#statement",
                            score: 13.626000000000001,
                            submitter_nick_id: 1,
                            children: {
                              "7": {
                                topic_id: 88,
                                camp_id: 7,
                                title: "Qualia are Material Qualities",
                                review_title: "Qualia are Material Qualities",
                                link: "/topic/88-Theories-of-Consciousness/7-Qualia-are-Material-Qualities#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/7-Qualia-are-Material-Qualities#statement",
                                score: 7.61,
                                submitter_nick_id: 1,
                                children: {
                                  "20": {
                                    topic_id: 88,
                                    camp_id: 20,
                                    title: "Orch OR",
                                    review_title: "Orch OR",
                                    link: "/topic/88-Theories-of-Consciousness/20-Orch-OR#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/20-Orch-OR#statement",
                                    score: 2.032,
                                    submitter_nick_id: 1,
                                    children: [],
                                  },
                                  "36": {
                                    topic_id: 88,
                                    camp_id: 36,
                                    title: "Molecular Materialism",
                                    review_title: "Molecular Materialism",
                                    link: "/topic/88-Theories-of-Consciousness/36-Molecular-Materialism#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/36-Molecular-Materialism#statement",
                                    score: 2.016,
                                    submitter_nick_id: 352,
                                    children: [],
                                  },
                                  "63": {
                                    topic_id: 88,
                                    camp_id: 63,
                                    title: "Energetic Monism",
                                    review_title: "Energetic Monism",
                                    link: "/topic/88-Theories-of-Consciousness/63-Energetic-Monism#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/63-Energetic-Monism#statement",
                                    score: 1.062,
                                    submitter_nick_id: 1,
                                    children: [],
                                  },
                                  "66": {
                                    topic_id: 88,
                                    camp_id: 66,
                                    title: "Qualia are Signaling Patterns",
                                    review_title:
                                      "Qualia are Signaling Patterns",
                                    link: "/topic/88-Theories-of-Consciousness/66-Qualia-are-Signaling-Patterns#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/66-Qualia-are-Signaling-Patterns#statement",
                                    score: 1.5,
                                    submitter_nick_id: 1,
                                    children: [],
                                  },
                                },
                              },
                              "18": {
                                topic_id: 88,
                                camp_id: 18,
                                title: "Qualia Emerge from Function",
                                review_title: "Qualia Emerge from Function",
                                link: "/topic/88-Theories-of-Consciousness/18-Qualia-Emerge-from-Function#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/18-Qualia-Emerge-from-Function#statement",
                                score: 6.016,
                                submitter_nick_id: 1,
                                children: {
                                  "13": {
                                    topic_id: 88,
                                    camp_id: 13,
                                    title: "D L S create UMSITW",
                                    review_title: "D L S create UMSITW",
                                    link: "/topic/88-Theories-of-Consciousness/13-D-L-S-create-UMSITW#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/13-D-L-S-create-UMSITW#statement",
                                    score: 1,
                                    submitter_nick_id: 85,
                                    children: [],
                                  },
                                  "21": {
                                    topic_id: 88,
                                    camp_id: 21,
                                    title: "Dennett's PBC Theory",
                                    review_title: "Dennett's PBC Theory",
                                    link: "/topic/88-Theories-of-Consciousness/21-Dennett-s-PBC-Theory#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/21-Dennett-s-PBC-Theory#statement",
                                    score: 1.016,
                                    submitter_nick_id: 1,
                                    children: [],
                                  },
                                  "23": {
                                    topic_id: 88,
                                    camp_id: 23,
                                    title: "representative/illusory",
                                    review_title: "representative/illusory",
                                    link: "/topic/88-Theories-of-Consciousness/23-representative-illusory#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/23-representative-illusory#statement",
                                    score: 0.75,
                                    submitter_nick_id: 1,
                                    children: {
                                      "24": {
                                        topic_id: 88,
                                        camp_id: 24,
                                        title: "rep/Illusion/architecture",
                                        review_title:
                                          "rep/Illusion/architecture",
                                        link: "/topic/88-Theories-of-Consciousness/24-rep-Illusion-architecture#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/24-rep-Illusion-architecture#statement",
                                        score: 0.75,
                                        submitter_nick_id: 131,
                                        children: {
                                          "31": {
                                            topic_id: 88,
                                            camp_id: 31,
                                            title: "Mind is brains illusion",
                                            review_title:
                                              "Mind is brains illusion",
                                            link: "/topic/88-Theories-of-Consciousness/31-Mind-is-brains-illusion#statement",
                                            review_link:
                                              "/topic/88-Theories-of-Consciousness/31-Mind-is-brains-illusion#statement",
                                            score: 0.75,
                                            submitter_nick_id: 131,
                                            children: {
                                              "32": {
                                                topic_id: 88,
                                                camp_id: 32,
                                                title: "Bird/Mammal Limitation",
                                                review_title:
                                                  "Bird/Mammal Limitation",
                                                link: "/topic/88-Theories-of-Consciousness/32-Bird-Mammal-Limitation#statement",
                                                review_link:
                                                  "/topic/88-Theories-of-Consciousness/32-Bird-Mammal-Limitation#statement",
                                                score: 0.75,
                                                submitter_nick_id: 131,
                                                children: [],
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  "37": {
                                    topic_id: 88,
                                    camp_id: 37,
                                    title: "Detect React Associate",
                                    review_title: "Detect React Associate",
                                    link: "/topic/88-Theories-of-Consciousness/37-Detect-React-Associate#statement",
                                    review_link:
                                      "/topic/88-Theories-of-Consciousness/37-Detect-React-Associate#statement",
                                    score: 1.25,
                                    submitter_nick_id: 1,
                                    children: {
                                      "38": {
                                        topic_id: 88,
                                        camp_id: 38,
                                        title: "x",
                                        review_title: "x",
                                        link: "/topic/88-Theories-of-Consciousness/38-x#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/38-x#statement",
                                        score: 0,
                                        submitter_nick_id: 131,
                                        children: [],
                                      },
                                      "39": {
                                        topic_id: 88,
                                        camp_id: 39,
                                        title: "DRA is not enough",
                                        review_title: "DRA is not enough",
                                        link: "/topic/88-Theories-of-Consciousness/39-DRA-is-not-enough#statement",
                                        review_link:
                                          "/topic/88-Theories-of-Consciousness/39-DRA-is-not-enough#statement",
                                        score: 0.25,
                                        submitter_nick_id: 131,
                                        children: [],
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      "28": {
                        topic_id: 88,
                        camp_id: 28,
                        title: "Dualism",
                        review_title: "Dualism",
                        link: "/topic/88-Theories-of-Consciousness/28-Dualism#statement",
                        review_link:
                          "/topic/88-Theories-of-Consciousness/28-Dualism#statement",
                        score: 0.079,
                        submitter_nick_id: 1,
                        children: [],
                      },
                      "48": {
                        topic_id: 88,
                        camp_id: 48,
                        title: "Substance Dualism",
                        review_title: "Substance Dualism",
                        link: "/topic/88-Theories-of-Consciousness/48-Substance-Dualism#statement",
                        review_link:
                          "/topic/88-Theories-of-Consciousness/48-Substance-Dualism#statement",
                        score: 7,
                        submitter_nick_id: 1,
                        children: {
                          "35": {
                            topic_id: 88,
                            camp_id: 35,
                            title: "Higher-dimension Theories",
                            review_title: "Higher-dimension Theories",
                            link: "/topic/88-Theories-of-Consciousness/35-Higher-dimension-Theories#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/35-Higher-dimension-Theories#statement",
                            score: 5,
                            submitter_nick_id: 1,
                            children: {
                              "14": {
                                topic_id: 88,
                                camp_id: 14,
                                title: "Smythies-Carr Hypothesis",
                                review_title: "Smythies-Carr Hypothesis",
                                link: "/topic/88-Theories-of-Consciousness/14-Smythies-Carr-Hypothesis#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/14-Smythies-Carr-Hypothesis#statement",
                                score: 1,
                                submitter_nick_id: 1,
                                children: [],
                              },
                              "29": {
                                topic_id: 88,
                                camp_id: 29,
                                title: "5th dimensional qualia.",
                                review_title: "5th dimensional qualia.",
                                link: "/topic/88-Theories-of-Consciousness/29-5th-dimensional-qualia-#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/29-5th-dimensional-qualia-#statement",
                                score: 3,
                                submitter_nick_id: 1,
                                children: [],
                              },
                              "47": {
                                topic_id: 88,
                                camp_id: 47,
                                title: "CYR String Hypothesis",
                                review_title: "CYR String Hypothesis",
                                link: "/topic/88-Theories-of-Consciousness/47-CYR-String-Hypothesis#statement",
                                review_link:
                                  "/topic/88-Theories-of-Consciousness/47-CYR-String-Hypothesis#statement",
                                score: 1,
                                submitter_nick_id: 231,
                                children: [],
                              },
                            },
                          },
                          "67": {
                            topic_id: 88,
                            camp_id: 67,
                            title: "Interactionist Dualism",
                            review_title: "Interactionist Dualism",
                            link: "/topic/88-Theories-of-Consciousness/67-Interactionist-Dualism#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/67-Interactionist-Dualism#statement",
                            score: 1,
                            submitter_nick_id: 421,
                            children: [],
                          },
                        },
                      },
                      "53": {
                        topic_id: 88,
                        camp_id: 53,
                        title: "Biological naturalism",
                        review_title: "Biological naturalism",
                        link: "/topic/88-Theories-of-Consciousness/53-Biological-naturalism#statement",
                        review_link:
                          "/topic/88-Theories-of-Consciousness/53-Biological-naturalism#statement",
                        score: 1,
                        submitter_nick_id: 35,
                        children: {
                          "55": {
                            topic_id: 88,
                            camp_id: 55,
                            title: "Self-centred VR",
                            review_title: "Self-centred VR",
                            link: "/topic/88-Theories-of-Consciousness/55-Self-centred-VR#statement",
                            review_link:
                              "/topic/88-Theories-of-Consciousness/55-Self-centred-VR#statement",
                            score: 1,
                            submitter_nick_id: 35,
                            children: [],
                          },
                        },
                      },
                    },
                  },
                  "11": {
                    topic_id: 88,
                    camp_id: 11,
                    title: "Not a Genuine Problem",
                    review_title: "Not a Genuine Problem",
                    link: "/topic/88-Theories-of-Consciousness/11-Not-a-Genuine-Problem#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/11-Not-a-Genuine-Problem#statement",
                    score: 0,
                    submitter_nick_id: 1,
                    children: {
                      "12": {
                        topic_id: 88,
                        camp_id: 12,
                        title: "Subjective, Though Real",
                        review_title: "Subjective, Though Real",
                        link: "/topic/88-Theories-of-Consciousness/12-Subjective--Though-Real#statement",
                        review_link:
                          "/topic/88-Theories-of-Consciousness/12-Subjective--Though-Real#statement",
                        score: 0,
                        submitter_nick_id: 1,
                        children: [],
                      },
                    },
                  },
                  "30": {
                    topic_id: 88,
                    camp_id: 30,
                    title: "Perception",
                    review_title: "Perception",
                    link: "/topic/88-Theories-of-Consciousness/30-Perception#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/30-Perception#statement",
                    score: 0,
                    submitter_nick_id: 144,
                    children: [],
                  },
                  "33": {
                    topic_id: 88,
                    camp_id: 33,
                    title: "Nexus Theory",
                    review_title: "Nexus Theory",
                    link: "/topic/88-Theories-of-Consciousness/33-Nexus-Theory#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/33-Nexus-Theory#statement",
                    score: 2,
                    submitter_nick_id: 159,
                    children: [],
                  },
                  "40": {
                    topic_id: 88,
                    camp_id: 40,
                    title: "Triadic Consciousness ",
                    review_title: "Triadic Consciousness ",
                    link: "/topic/88-Theories-of-Consciousness/40-Triadic-Consciousness-#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/40-Triadic-Consciousness-#statement",
                    score: 0,
                    submitter_nick_id: 178,
                    children: [],
                  },
                  "42": {
                    topic_id: 88,
                    camp_id: 42,
                    title: '"Mind" is behavior.',
                    review_title: '"Mind" is behavior.',
                    link: "/topic/88-Theories-of-Consciousness/42--Mind--is-behavior-#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/42--Mind--is-behavior-#statement",
                    score: 0,
                    submitter_nick_id: 181,
                    children: [],
                  },
                  "43": {
                    topic_id: 88,
                    camp_id: 43,
                    title: "Temporal encoding",
                    review_title: "Temporal encoding",
                    link: "/topic/88-Theories-of-Consciousness/43-Temporal-encoding#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/43-Temporal-encoding#statement",
                    score: 0,
                    submitter_nick_id: 211,
                    children: [],
                  },
                  "44": {
                    topic_id: 88,
                    camp_id: 44,
                    title: "Interactivism",
                    review_title: "Interactivism",
                    link: "/topic/88-Theories-of-Consciousness/44-Interactivism#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/44-Interactivism#statement",
                    score: 0,
                    submitter_nick_id: 219,
                    children: [],
                  },
                  "45": {
                    topic_id: 88,
                    camp_id: 45,
                    title: "Interactivism",
                    review_title: "Interactivism",
                    link: "/topic/88-Theories-of-Consciousness/45-Interactivism#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/45-Interactivism#statement",
                    score: 1.125,
                    submitter_nick_id: 219,
                    children: [],
                  },
                  "49": {
                    topic_id: 88,
                    camp_id: 49,
                    title: "Ideal Monism",
                    review_title: "Ideal Monism",
                    link: "/topic/88-Theories-of-Consciousness/49-Ideal-Monism#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/49-Ideal-Monism#statement",
                    score: 2.0629999999999997,
                    submitter_nick_id: 198,
                    children: {
                      "52": {
                        topic_id: 88,
                        camp_id: 52,
                        title: "Sense Monism",
                        review_title: "Sense Monism",
                        link: "/topic/88-Theories-of-Consciousness/52-Sense-Monism#statement",
                        review_link:
                          "/topic/88-Theories-of-Consciousness/52-Sense-Monism#statement",
                        score: 0,
                        submitter_nick_id: 261,
                        children: [],
                      },
                    },
                  },
                  "60": {
                    topic_id: 88,
                    camp_id: 60,
                    title: "Model Based Approaches",
                    review_title: "Model Based Approaches",
                    link: "/topic/88-Theories-of-Consciousness/60-Model-Based-Approaches#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/60-Model-Based-Approaches#statement",
                    score: 0.532,
                    submitter_nick_id: 322,
                    children: [],
                  },
                  "62": {
                    topic_id: 88,
                    camp_id: 62,
                    title: "General resonance theory",
                    review_title: "General resonance theory",
                    link: "/topic/88-Theories-of-Consciousness/62-General-resonance-theory#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/62-General-resonance-theory#statement",
                    score: 2.157,
                    submitter_nick_id: 359,
                    children: [],
                  },
                  "70": {
                    topic_id: 88,
                    camp_id: 70,
                    title: "Consciousness pervade unive",
                    review_title: "Consciousness pervade unive",
                    link: "/topic/88-Theories-of-Consciousness/70-Consciousness-pervade-unive#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/70-Consciousness-pervade-unive#statement",
                    score: 0.281,
                    submitter_nick_id: 453,
                    children: [],
                  },
                  "74": {
                    topic_id: 88,
                    camp_id: 74,
                    title: "Correspondism",
                    review_title: "Correspondism",
                    link: "/topic/88-Theories-of-Consciousness/74-Correspondism#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/74-Correspondism#statement",
                    score: 1,
                    submitter_nick_id: 552,
                    children: [],
                  },
                },
              },
              "26": {
                topic_id: 88,
                camp_id: 26,
                title: "Structurally coded",
                review_title: "Structurally coded",
                link: "/topic/88-Theories-of-Consciousness/26-Structurally-coded#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/26-Structurally-coded#statement",
                score: 0.258,
                submitter_nick_id: 87,
                children: {
                  "27": {
                    topic_id: 88,
                    camp_id: 27,
                    title: "Coded Ordered Water",
                    review_title: "Coded Ordered Water",
                    link: "/topic/88-Theories-of-Consciousness/27-Coded-Ordered-Water#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/27-Coded-Ordered-Water#statement",
                    score: 0.258,
                    submitter_nick_id: 87,
                    children: [],
                  },
                },
              },
              "57": {
                topic_id: 88,
                camp_id: 57,
                title: "Unapproachable Via Science",
                review_title: "Unapproachable Via Science",
                link: "/topic/88-Theories-of-Consciousness/57-Unapproachable-Via-Science#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/57-Unapproachable-Via-Science#statement",
                score: 4,
                submitter_nick_id: 1,
                children: {
                  "25": {
                    topic_id: 88,
                    camp_id: 25,
                    title: "Advaita and Consciousness",
                    review_title: "Advaita and Consciousness",
                    link: "/topic/88-Theories-of-Consciousness/25-Advaita-and-Consciousness#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/25-Advaita-and-Consciousness#statement",
                    score: 2,
                    submitter_nick_id: 1,
                    children: [],
                  },
                  "41": {
                    topic_id: 88,
                    camp_id: 41,
                    title: "Consciousness is Divine",
                    review_title: "Consciousness is Divine",
                    link: "/topic/88-Theories-of-Consciousness/41-Consciousness-is-Divine#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/41-Consciousness-is-Divine#statement",
                    score: 1,
                    submitter_nick_id: 1,
                    children: [],
                  },
                  "58": {
                    topic_id: 88,
                    camp_id: 58,
                    title: "Panexperientialism",
                    review_title: "Panexperientialism",
                    link: "/topic/88-Theories-of-Consciousness/58-Panexperientialism#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/58-Panexperientialism#statement",
                    score: 1,
                    submitter_nick_id: 309,
                    children: [],
                  },
                },
              },
              "68": {
                topic_id: 88,
                camp_id: 68,
                title: "Hard conciousness",
                review_title: "Hard conciousness",
                link: "/topic/88-Theories-of-Consciousness/68-Hard-conciousness#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/68-Hard-conciousness#statement",
                score: 0.25,
                submitter_nick_id: 453,
                children: [],
              },
              "69": {
                topic_id: 88,
                camp_id: 69,
                title: "main idea of consciousness",
                review_title: "main idea of consciousness",
                link: "/topic/88-Theories-of-Consciousness/69-main-idea-of-consciousness#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/69-main-idea-of-consciousness#statement",
                score: 0.125,
                submitter_nick_id: 453,
                children: [],
              },
              "71": {
                topic_id: 88,
                camp_id: 71,
                title: "CONCEPTS OF CONSCIOUSNESS",
                review_title: "CONCEPTS OF CONSCIOUSNESS",
                link: "/topic/88-Theories-of-Consciousness/71-CONCEPTS-OF-CONSCIOUSNESS#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/71-CONCEPTS-OF-CONSCIOUSNESS#statement",
                score: 0.504,
                submitter_nick_id: 453,
                children: {
                  "72": {
                    topic_id: 88,
                    camp_id: 72,
                    title: "access conscious",
                    review_title: "access conscious",
                    link: "/topic/88-Theories-of-Consciousness/72-access-conscious#statement",
                    review_link:
                      "/topic/88-Theories-of-Consciousness/72-access-conscious#statement",
                    score: 0,
                    submitter_nick_id: 453,
                    children: [],
                  },
                },
              },
              "73": {
                topic_id: 88,
                camp_id: 73,
                title: "Information Integration Theory",
                review_title: "Information Integration Theory",
                link: "/topic/88-Theories-of-Consciousness/73-Information-Integration-Theory#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/73-Information-Integration-Theory#statement",
                score: 0,
                submitter_nick_id: 453,
                children: [],
              },
              "75": {
                topic_id: 88,
                camp_id: 75,
                title: "camp1",
                review_title: "camp1",
                link: "/topic/88-Theories-of-Consciousness/75-camp1#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/75-camp1#statement",
                score: 0,
                submitter_nick_id: 571,
                children: [],
              },
              "76": {
                topic_id: 88,
                camp_id: 76,
                title: "15 test",
                review_title: "15 test",
                link: "/topic/88-Theories-of-Consciousness/76-15-test#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/76-15-test#statement",
                score: 0,
                submitter_nick_id: 563,
                children: [],
              },
              "77": {
                topic_id: 88,
                camp_id: 77,
                title: "22  camp test",
                review_title: "22  camp test",
                link: "/topic/88-Theories-of-Consciousness/77-22--camp-test#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/77-22--camp-test#statement",
                score: 0,
                submitter_nick_id: 563,
                children: [],
              },
              "78": {
                topic_id: 88,
                camp_id: 78,
                title: "test 001",
                review_title: "test 001",
                link: "/topic/88-Theories-of-Consciousness/78-test-001#statement",
                review_link:
                  "/topic/88-Theories-of-Consciousness/78-test-001#statement",
                score: 0,
                submitter_nick_id: 563,
                children: [],
              },
            },
          },
        },
      ],
      code: 200,
      success: true,
    };
    //   await NetworkCall.fetch(TreeRequest.getTrees(reqBody), false);
    // const trees = await NetworkCall.fetch(TreeRequest.getTrees(reqBody), false);

    // const result = Joi.validate(trees, removeRelationSchema);
    // const result = TreeStructureSchema.validate(trees.data[0]);
    // console.log("first", result);
    // const validate = ajv.compile(schema);
    // const valid = validate(trees);
    // if (!valid) console.log("validator", validate);

    store.dispatch(setTree(trees.data[0]));
    return trees.data[0];
  } catch (error) {
    // message.error(error.message);
  }
};

export const getNewsFeedApi = async (reqBody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getNewsFeed(reqBody, auth?.loggedInUser?.token),
      false
    );
    store.dispatch(setNewsFeed(newsFeed?.data));
    return newsFeed?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedCampStatementApi = async (reqBody) => {
  try {
    const campStatement = await NetworkCall.fetch(
      TreeRequest.getCampStatement(reqBody),
      false
    );
    store.dispatch(setCampStatement(campStatement?.data));
    return campStatement?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentTopicRecordApi = async (reqBody) => {
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentTopicRecord(reqBody),
      false
    );
    store.dispatch(setCurrentTopicRecord(currentTopicRecord?.data));
    return currentTopicRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCurrentCampRecordApi = async (reqBody) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const currentCampRecord = await NetworkCall.fetch(
      TreeRequest.getCurrentCampRecord(reqBody, auth.loggedInUser?.token),
      false
    );

    store.dispatch(setCurrentCampRecord(currentCampRecord?.data));
    return currentCampRecord?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const subscribeToCampApi = async (reqBody, isTopic: Boolean) => {
  let state = store.getState();
  const { auth } = state;
  try {
    const subscribeToCamp = await NetworkCall.fetch(
      TreeRequest.subscribeToCamp(reqBody, auth.loggedInUser?.token),
      false
    );
    isTopic
      ? store.dispatch(
          setCurrentTopicRecordSubscriptionId(
            subscribeToCamp?.data?.subscriptionId || null
          )
        )
      : store.dispatch(
          setCurrentCampRecordSubscriptionId(
            subscribeToCamp?.data?.subscriptionId || null
          )
        );
    subscribeToCamp?.data?.msg
      ? message.info(subscribeToCamp?.data?.msg)
      : message.info(subscribeToCamp?.message);
    return subscribeToCamp?.data;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getCanonizedCampSupportingTreeApi = async (
  reqBody,
  loadMore = false
) => {
  try {
    // const supportingTree = await NetworkCall.fetch(
    //   TreeRequest.getCampSupportingTree(reqBody), false
    // );
    const mockSupporters = [
      {
        id: 1,
        name: "1:shahab",
        score: 1,
      },
      {
        id: 1,
        name: "Awais",
        score: 234,
      },
      {
        id: 1,
        name: "Umair",
        score: 234,
      },
      {
        id: 1,
        name: "Shawaiz",
        score: 234,
      },
      {
        id: 1,
        name: "Ahmed",
        score: 234,
      },
      {
        id: 1,
        name: "Darab",
        score: 234,
      },
      {
        id: 1,
        name: "wahaj",
        score: 234,
      },
      {
        id: 1,
        name: "shahzaib",
        score: 234,
      },
      {
        id: 1,
        name: "Talha",
        score: 234,
      },
      {
        id: 1,
        name: "Saim",
        score: 234,
      },
    ];
    if (loadMore) {
      store.dispatch(pushToCampSupportingTree(mockSupporters));
    } else {
      store.dispatch(setCampSupportingTree(mockSupporters));
    }
    return mockSupporters;
  } catch (error) {
    message.error(error.message);
  }
};

export const createCamp = async (body) => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.createCamp(body));
    return res;
  } catch (err) {
    if (
      err &&
      err.error &&
      err.error.data &&
      err.error.data.status_code === 400 &&
      !err.error.data.error?.camp_name &&
      !err.error.data.error?.camp_about_url
    ) {
      handleError(err);
    } else {
      return err?.error?.data;
    }
  }
};

export const getAllParentsCamp = async (body) => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.getAllParentsCamp(body));
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const getAllCampNickNames = async () => {
  try {
    const res = await NetworkCall.fetch(TreeRequest.getAllCampNickNames());
    return res;
  } catch (error) {
    handleError(error);
  }
};

export const getAllUsedNickNames = async (body) => {
  try {
    const res = await NetworkCall.fetch(
      TreeRequest.getUsedNickNames(body),
      false
    );
    return res;
  } catch (error) {
    handleError(error);
    return error.error;
  }
};
export const getCampBreadCrumbApi = async (reqBody) => {
  try {
    const currentTopicRecord = await NetworkCall.fetch(
      TreeRequest.getCampBreadCrumb(reqBody),
      false
    );
    return currentTopicRecord;
  } catch (error) {
    // message.error(error.message);
  }
};

export const getTopicActivityLogApi = async (reqBody) => {
  try {
    const newsFeed = await NetworkCall.fetch(
      TreeRequest.getTopicActivityLog(reqBody),
      false
    );
    return newsFeed;
  } catch (error) {
    message.error(error.message);
  }
};
