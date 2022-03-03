import { useEffect, useState } from "react";
import { getTreesApi } from "src/network/api/treeApi";
import { Tree, Card } from "antd";
import { CarryOutOutlined, FormOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import Styles from '../campTree.module.scss';

const { TreeNode } = Tree;
const CampTree = (props) => {
  const [treesList, setTreesList] = useState();
  const { tree } = useSelector((state: RootState) => ({
    tree: state?.trees?.tree,
  }));
  useEffect(() => {
    async function getTreesApiCallFunc() {
      const reqBody = {
        topic_num: 88,
        asofdate: 1644323333,
        algorithm: "mind_experts",
        update_all: 0,
      };
      const response = await getTreesApi(reqBody);

      await setTreesList(response);
    }
    getTreesApiCallFunc();
  }, []);

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const renderTreeNodes = (data: any) =>
    Object.keys(data).map((item) => {
      if (data[item].children) {
        return (
          <TreeNode
            // switcherIcon={<PlusSquareOutlined />}
            title={
              <div className={"treeListItem " + Styles.treeListItem}>
                <span className={"treeListItemTitle " + Styles.treeListItemTitle}> {data[item].title}</span>
                <span className={"treeListItemNumber " + Styles.treeListItemNumber}> {data[item].score}</span>
              </div>
            }
            key={data[item].camp_id}
            // link={data[item].link}
            // review_link={data[item].review_link}
            // review_title={data[item].review_title}
            // score={data[item].score}
            // topic_id={data[item].topic_id}
            // dataRef={data[item]}
          >
            {renderTreeNodes(data[item].children)}
          </TreeNode>
        );
      }
      return <TreeNode key={data[item].key} {...data[item]} />;
    });

  const mockTree = {
    data: [
      {
        "1": {
          topic_id: 88,
          camp_id: 1,
          title: "Theories of Consciousness",
          review_title: "Theories of Consciousness",
          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/1-Agreement",
          review_link:
            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/1-Agreement",
          score: 13.5,
          children: {
            "2": {
              topic_id: 88,
              camp_id: 2,
              title: "Approachable Via Science",
              review_title: "Approachable Via Science",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/2-Approachable-Via-Science#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/2-Approachable-Via-Science#statement",
              score: 13.5,
              children: {
                "6": {
                  topic_id: 88,
                  camp_id: 6,
                  title: "Representational Qualia",
                  review_title: "Representational Qualia",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/6-Representational-Qualia#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/6-Representational-Qualia#statement",
                  score: 13.5,
                  children: {
                    "17": {
                      topic_id: 88,
                      camp_id: 17,
                      title: "Mind-Brain Identity",
                      review_title: "Mind-Brain Identity",
                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/17-Mind-Brain-Identity#statement",
                      review_link:
                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/17-Mind-Brain-Identity#statement",
                      score: 11.5,
                      children: {
                        "19": {
                          topic_id: 88,
                          camp_id: 19,
                          title: "Property Dualism",
                          review_title: "Property Dualism",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/19-Property-Dualism#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/19-Property-Dualism#statement",
                          score: 5.5,
                          children: {
                            "34": {
                              topic_id: 88,
                              camp_id: 34,
                              title: "Panexperientialism",
                              review_title: "Panexperientialism",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/34-Panexperientialism#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/34-Panexperientialism#statement",
                              score: 3,
                              children: {
                                "3": {
                                  topic_id: 88,
                                  camp_id: 3,
                                  title: "Absolute space conscious",
                                  review_title: "Absolute space conscious",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/3-Absolute-space-conscious#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/3-Absolute-space-conscious#statement",
                                  score: 2,
                                  children: {
                                    "4": {
                                      topic_id: 88,
                                      camp_id: 4,
                                      title: "Consciousness fundamntal",
                                      review_title: "Consciousness fundamntal",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/4-Consciousness-fundamntal#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/4-Consciousness-fundamntal#statement",
                                      score: 2,
                                      children: {
                                        "5": {
                                          topic_id: 88,
                                          camp_id: 5,
                                          title: "Mind is a separate field",
                                          review_title:
                                            "Mind is a separate field",
                                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/5-Mind-is-a-separate-field#statement",
                                          review_link:
                                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/5-Mind-is-a-separate-field#statement",
                                          score: 2,
                                          children: [],
                                        },
                                      },
                                    },
                                    "22": {
                                      topic_id: 88,
                                      camp_id: 22,
                                      title: "Spacetime geometry",
                                      review_title: "Spacetime geometry",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/22-Spacetime-geometry#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/22-Spacetime-geometry#statement",
                                      score: 0,
                                      children: [],
                                    },
                                  },
                                },
                                "61": {
                                  topic_id: 88,
                                  camp_id: 61,
                                  title: "Physicalistic Idealism",
                                  review_title: "Physicalistic Idealism",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/61-Physicalistic-Idealism#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/61-Physicalistic-Idealism#statement",
                                  score: 0,
                                  children: [],
                                },
                                "50": {
                                  topic_id: 88,
                                  camp_id: 50,
                                  title: "Multisense Realism",
                                  review_title: "Multisense Realism",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/50-Multisense-Realism#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/50-Multisense-Realism#statement",
                                  score: 0,
                                  children: {
                                    "51": {
                                      topic_id: 88,
                                      camp_id: 51,
                                      title: "Qualitative Present",
                                      review_title: "Qualitative Present",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/51-Qualitative-Present#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/51-Qualitative-Present#statement",
                                      score: 0,
                                      children: [],
                                    },
                                  },
                                },
                                "56": {
                                  topic_id: 88,
                                  camp_id: 56,
                                  title: "Holistic Panexperientiali",
                                  review_title: "Holistic Panexperientiali",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/56-Holistic-Panexperientiali#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/56-Holistic-Panexperientiali#statement",
                                  score: 0,
                                  children: [],
                                },
                                "46": {
                                  topic_id: 88,
                                  camp_id: 46,
                                  title: "force of physics",
                                  review_title: "force of physics",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/46-force-of-physics#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/46-force-of-physics#statement",
                                  score: 0,
                                  children: [],
                                },
                              },
                            },
                            "8": {
                              topic_id: 88,
                              camp_id: 8,
                              title: "Functional Prprty Dualism",
                              review_title: "Functional Prprty Dualism",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/8-Functional-Prprty-Dualism#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/8-Functional-Prprty-Dualism#statement",
                              score: 0,
                              children: {
                                "54": {
                                  topic_id: 88,
                                  camp_id: 54,
                                  title: "HST",
                                  review_title: "HST",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/54-HST#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/54-HST#statement",
                                  score: 0,
                                  children: [],
                                },
                                "10": {
                                  topic_id: 88,
                                  camp_id: 10,
                                  title: "Biological naturalism",
                                  review_title: "Biological naturalism",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/10-Biological-naturalism#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/10-Biological-naturalism#statement",
                                  score: 0,
                                  children: [],
                                },
                                "9": {
                                  topic_id: 88,
                                  camp_id: 9,
                                  title: "Comp Functionalism",
                                  review_title: "Comp Functionalism",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/9-Comp-Functionalism#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/9-Comp-Functionalism#statement",
                                  score: 0,
                                  children: {
                                    "16": {
                                      topic_id: 88,
                                      camp_id: 16,
                                      title: "quasi-functionalism",
                                      review_title: "quasi-functionalism",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/16-quasi-functionalism#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/16-quasi-functionalism#statement",
                                      score: 0,
                                      children: [],
                                    },
                                  },
                                },
                              },
                            },
                            "59": {
                              topic_id: 88,
                              camp_id: 59,
                              title: "Integrated Information",
                              review_title: "Integrated Information",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/59-Integrated-Information#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/59-Integrated-Information#statement",
                              score: 0,
                              children: [],
                            },
                          },
                        },
                        "65": {
                          topic_id: 88,
                          camp_id: 65,
                          title: "Monism",
                          review_title: "Monism",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/65-Monism#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/65-Monism#statement",
                          score: 3.5,
                          children: {
                            "7": {
                              topic_id: 88,
                              camp_id: 7,
                              title: "Qualia are Material Quali",
                              review_title: "Qualia are Material Quali",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/7-Qualia-are-Material-Quali#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/7-Qualia-are-Material-Quali#statement",
                              score: 2.5,
                              children: {
                                "66": {
                                  topic_id: 88,
                                  camp_id: 66,
                                  title: "Qualia are Signaling Patterns",
                                  review_title: "Qualia are Signaling Patterns",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/66-Qualia-are-Signaling-Patterns#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/66-Qualia-are-Signaling-Patterns#statement",
                                  score: 2.5,
                                  children: [],
                                },
                                "63": {
                                  topic_id: 88,
                                  camp_id: 63,
                                  title: "Energetic Monism",
                                  review_title: "Energetic Monism",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/63-Energetic-Monism#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/63-Energetic-Monism#statement",
                                  score: 0,
                                  children: [],
                                },
                                "36": {
                                  topic_id: 88,
                                  camp_id: 36,
                                  title: "Molecular Materialism",
                                  review_title: "Molecular Materialism",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/36-Molecular-Materialism#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/36-Molecular-Materialism#statement",
                                  score: 0,
                                  children: [],
                                },
                                "20": {
                                  topic_id: 88,
                                  camp_id: 20,
                                  title: "Orch OR",
                                  review_title: "Orch OR",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/20-Orch-OR#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/20-Orch-OR#statement",
                                  score: 0,
                                  children: [],
                                },
                              },
                            },
                            "18": {
                              topic_id: 88,
                              camp_id: 18,
                              title: "Qualia Emerge from Function",
                              review_title: "Qualia Emerge from Function",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/18-Qualia-Emerge-from-Function#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/18-Qualia-Emerge-from-Function#statement",
                              score: 1,
                              children: {
                                "37": {
                                  topic_id: 88,
                                  camp_id: 37,
                                  title: "Detect React Associate",
                                  review_title: "Detect React Associate",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/37-Detect-React-Associate#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/37-Detect-React-Associate#statement",
                                  score: 0.5,
                                  children: {
                                    "39": {
                                      topic_id: 88,
                                      camp_id: 39,
                                      title: "DRA is not enough",
                                      review_title: "DRA is not enough",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/39-DRA-is-not-enough#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/39-DRA-is-not-enough#statement",
                                      score: 0.5,
                                      children: [],
                                    },
                                    "38": {
                                      topic_id: 88,
                                      camp_id: 38,
                                      title: "x",
                                      review_title: "x",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/38-x#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/38-x#statement",
                                      score: 0,
                                      children: [],
                                    },
                                  },
                                },
                                "23": {
                                  topic_id: 88,
                                  camp_id: 23,
                                  title: "representative/illusory",
                                  review_title: "representative/illusory",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/23-representative-illusory#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/23-representative-illusory#statement",
                                  score: 0.5,
                                  children: {
                                    "24": {
                                      topic_id: 88,
                                      camp_id: 24,
                                      title: "rep/Illusion/architecture",
                                      review_title: "rep/Illusion/architecture",
                                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/24-rep-Illusion-architecture#statement",
                                      review_link:
                                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/24-rep-Illusion-architecture#statement",
                                      score: 0.5,
                                      children: {
                                        "31": {
                                          topic_id: 88,
                                          camp_id: 31,
                                          title: "Mind is brains illusion",
                                          review_title:
                                            "Mind is brains illusion",
                                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/31-Mind-is-brains-illusion#statement",
                                          review_link:
                                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/31-Mind-is-brains-illusion#statement",
                                          score: 0.5,
                                          children: {
                                            "32": {
                                              topic_id: 88,
                                              camp_id: 32,
                                              title: "Bird/Mammal Limitation",
                                              review_title:
                                                "Bird/Mammal Limitation",
                                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/32-Bird-Mammal-Limitation#statement",
                                              review_link:
                                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/32-Bird-Mammal-Limitation#statement",
                                              score: 0.5,
                                              children: [],
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                                "13": {
                                  topic_id: 88,
                                  camp_id: 13,
                                  title: "D L S create UMSITW",
                                  review_title: "D L S create UMSITW",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/13-D-L-S-create-UMSITW#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/13-D-L-S-create-UMSITW#statement",
                                  score: 0,
                                  children: [],
                                },
                                "21": {
                                  topic_id: 88,
                                  camp_id: 21,
                                  title: "Dennett's PBC Theory",
                                  review_title: "Dennett's PBC Theory",
                                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/21-Dennett-s-PBC-Theory#statement",
                                  review_link:
                                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/21-Dennett-s-PBC-Theory#statement",
                                  score: 0,
                                  children: [],
                                },
                              },
                            },
                          },
                        },
                        "64": {
                          topic_id: 88,
                          camp_id: 64,
                          title: "Integrated Information Theory",
                          review_title: "Integrated Information Theory",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/64-Integrated-Information-Theory#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/64-Integrated-Information-Theory#statement",
                          score: 0,
                          children: [],
                        },
                        "15": {
                          topic_id: 88,
                          camp_id: 15,
                          title: "SCVR",
                          review_title: "SCVR",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/15-SCVR#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/15-SCVR#statement",
                          score: 0,
                          children: [],
                        },
                      },
                    },
                    "48": {
                      topic_id: 88,
                      camp_id: 48,
                      title: "Substance Dualism",
                      review_title: "Substance Dualism",
                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/48-Substance-Dualism#statement",
                      review_link:
                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/48-Substance-Dualism#statement",
                      score: 2,
                      children: {
                        "35": {
                          topic_id: 88,
                          camp_id: 35,
                          title: "Higher-dimension Theories",
                          review_title: "Higher-dimension Theories",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/35-Higher-dimension-Theories#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/35-Higher-dimension-Theories#statement",
                          score: 2,
                          children: {
                            "14": {
                              topic_id: 88,
                              camp_id: 14,
                              title: "Smythies-Carr Hypothesis",
                              review_title: "Smythies-Carr Hypothesis",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/14-Smythies-Carr-Hypothesis#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/14-Smythies-Carr-Hypothesis#statement",
                              score: 1,
                              children: [],
                            },
                            "29": {
                              topic_id: 88,
                              camp_id: 29,
                              title: "5th dimensional qualia.",
                              review_title: "5th dimensional qualia.",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/29-5th-dimensional-qualia-#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/29-5th-dimensional-qualia-#statement",
                              score: 1,
                              children: [],
                            },
                            "47": {
                              topic_id: 88,
                              camp_id: 47,
                              title: "CYR String Hypothesis",
                              review_title: "CYR String Hypothesis",
                              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/47-CYR-String-Hypothesis#statement",
                              review_link:
                                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/47-CYR-String-Hypothesis#statement",
                              score: 0,
                              children: [],
                            },
                          },
                        },
                        "67": {
                          topic_id: 88,
                          camp_id: 67,
                          title: "Interactionist Dualism",
                          review_title: "Interactionist Dualism",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/67-Interactionist-Dualism#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/67-Interactionist-Dualism#statement",
                          score: 0,
                          children: [],
                        },
                      },
                    },
                    "28": {
                      topic_id: 88,
                      camp_id: 28,
                      title: "Dualism",
                      review_title: "Dualism",
                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/28-Dualism#statement",
                      review_link:
                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/28-Dualism#statement",
                      score: 0,
                      children: [],
                    },
                    "53": {
                      topic_id: 88,
                      camp_id: 53,
                      title: "Biological naturalism",
                      review_title: "Biological naturalism",
                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/53-Biological-naturalism#statement",
                      review_link:
                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/53-Biological-naturalism#statement",
                      score: 0,
                      children: {
                        "55": {
                          topic_id: 88,
                          camp_id: 55,
                          title: "Self-centred VR",
                          review_title: "Self-centred VR",
                          link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/55-Self-centred-VR#statement",
                          review_link:
                            "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/55-Self-centred-VR#statement",
                          score: 0,
                          children: [],
                        },
                      },
                    },
                  },
                },
                "74": {
                  topic_id: 88,
                  camp_id: 74,
                  title: "Correspondism",
                  review_title: "Correspondism",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/74-Correspondism#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/74-Correspondism#statement",
                  score: 0,
                  children: [],
                },
                "70": {
                  topic_id: 88,
                  camp_id: 70,
                  title: "Consciousness pervade unive",
                  review_title: "Consciousness pervade unive",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/70-Consciousness-pervade-unive#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/70-Consciousness-pervade-unive#statement",
                  score: 0,
                  children: [],
                },
                "33": {
                  topic_id: 88,
                  camp_id: 33,
                  title: "Nexus Theory",
                  review_title: "Nexus Theory",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/33-Nexus-Theory#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/33-Nexus-Theory#statement",
                  score: 0,
                  children: [],
                },
                "62": {
                  topic_id: 88,
                  camp_id: 62,
                  title: "General resonance theory",
                  review_title: "General resonance theory",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/62-General-resonance-theory#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/62-General-resonance-theory#statement",
                  score: 0,
                  children: [],
                },
                "60": {
                  topic_id: 88,
                  camp_id: 60,
                  title: "Model Based Approaches",
                  review_title: "Model Based Approaches",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/60-Model-Based-Approaches#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/60-Model-Based-Approaches#statement",
                  score: 0,
                  children: [],
                },
                "49": {
                  topic_id: 88,
                  camp_id: 49,
                  title: "Ideal Monism",
                  review_title: "Ideal Monism",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/49-Ideal-Monism#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/49-Ideal-Monism#statement",
                  score: 0,
                  children: {
                    "52": {
                      topic_id: 88,
                      camp_id: 52,
                      title: "Sense Monism",
                      review_title: "Sense Monism",
                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/52-Sense-Monism#statement",
                      review_link:
                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/52-Sense-Monism#statement",
                      score: 0,
                      children: [],
                    },
                  },
                },
                "45": {
                  topic_id: 88,
                  camp_id: 45,
                  title: "Interactivism",
                  review_title: "Interactivism",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/45-Interactivism#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/45-Interactivism#statement",
                  score: 0,
                  children: [],
                },
                "44": {
                  topic_id: 88,
                  camp_id: 44,
                  title: "Interactivism",
                  review_title: "Interactivism",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/44-Interactivism#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/44-Interactivism#statement",
                  score: 0,
                  children: [],
                },
                "43": {
                  topic_id: 88,
                  camp_id: 43,
                  title: "Temporal encoding",
                  review_title: "Temporal encoding",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/43-Temporal-encoding#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/43-Temporal-encoding#statement",
                  score: 0,
                  children: [],
                },
                "42": {
                  topic_id: 88,
                  camp_id: 42,
                  title: '"Mind" is behavior.',
                  review_title: '"Mind" is behavior.',
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/42--Mind--is-behavior-#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/42--Mind--is-behavior-#statement",
                  score: 0,
                  children: [],
                },
                "40": {
                  topic_id: 88,
                  camp_id: 40,
                  title: "Triadic Consciousness ",
                  review_title: "Triadic Consciousness ",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/40-Triadic-Consciousness-#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/40-Triadic-Consciousness-#statement",
                  score: 0,
                  children: [],
                },
                "30": {
                  topic_id: 88,
                  camp_id: 30,
                  title: "Perception",
                  review_title: "Perception",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/30-Perception#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/30-Perception#statement",
                  score: 0,
                  children: [],
                },
                "11": {
                  topic_id: 88,
                  camp_id: 11,
                  title: "Not a Genuine Problem",
                  review_title: "Not a Genuine Problem",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/11-Not-a-Genuine-Problem#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/11-Not-a-Genuine-Problem#statement",
                  score: 0,
                  children: {
                    "12": {
                      topic_id: 88,
                      camp_id: 12,
                      title: "Subjective, Though Real",
                      review_title: "Subjective, Though Real",
                      link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/12-Subjective--Though-Real#statement",
                      review_link:
                        "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/12-Subjective--Though-Real#statement",
                      score: 0,
                      children: [],
                    },
                  },
                },
              },
            },
            "73": {
              topic_id: 88,
              camp_id: 73,
              title: "Information Integration Theory",
              review_title: "Information Integration Theory",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/73-Information-Integration-Theory#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/73-Information-Integration-Theory#statement",
              score: 0,
              children: [],
            },
            "71": {
              topic_id: 88,
              camp_id: 71,
              title: "CONCEPTS OF CONSCIOUSNESS",
              review_title: "CONCEPTS OF CONSCIOUSNESS",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/71-CONCEPTS-OF-CONSCIOUSNESS#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/71-CONCEPTS-OF-CONSCIOUSNESS#statement",
              score: 0,
              children: {
                "72": {
                  topic_id: 88,
                  camp_id: 72,
                  title: "access conscious",
                  review_title: "access conscious",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/72-access-conscious#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/72-access-conscious#statement",
                  score: 0,
                  children: [],
                },
              },
            },
            "69": {
              topic_id: 88,
              camp_id: 69,
              title: "main idea of consciousness",
              review_title: "main idea of consciousness",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/69-main-idea-of-consciousness#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/69-main-idea-of-consciousness#statement",
              score: 0,
              children: [],
            },
            "68": {
              topic_id: 88,
              camp_id: 68,
              title: "Hard conciousness",
              review_title: "Hard conciousness",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/68-Hard-conciousness#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/68-Hard-conciousness#statement",
              score: 0,
              children: [],
            },
            "57": {
              topic_id: 88,
              camp_id: 57,
              title: "Unapproachable Via Science",
              review_title: "Unapproachable Via Science",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/57-Unapproachable-Via-Science#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/57-Unapproachable-Via-Science#statement",
              score: 0,
              children: {
                "41": {
                  topic_id: 88,
                  camp_id: 41,
                  title: "Consciousness is Divine",
                  review_title: "Consciousness is Divine",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/41-Consciousness-is-Divine#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/41-Consciousness-is-Divine#statement",
                  score: 0,
                  children: [],
                },
                "25": {
                  topic_id: 88,
                  camp_id: 25,
                  title: "Advaita and Consciousness",
                  review_title: "Advaita and Consciousness",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/25-Advaita-and-Consciousness#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/25-Advaita-and-Consciousness#statement",
                  score: 0,
                  children: [],
                },
                "58": {
                  topic_id: 88,
                  camp_id: 58,
                  title: "Panexperientialism",
                  review_title: "Panexperientialism",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/58-Panexperientialism#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/58-Panexperientialism#statement",
                  score: 0,
                  children: [],
                },
              },
            },
            "26": {
              topic_id: 88,
              camp_id: 26,
              title: "Structurally coded",
              review_title: "Structurally coded",
              link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/26-Structurally-coded#statement",
              review_link:
                "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/26-Structurally-coded#statement",
              score: 0,
              children: {
                "27": {
                  topic_id: 88,
                  camp_id: 27,
                  title: "Coded Ordered Water",
                  review_title: "Coded Ordered Water",
                  link: "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/27-Coded-Ordered-Water#statement",
                  review_link:
                    "https://staging.canonizer.com/topic/88-Theories-of-Consciousness/27-Coded-Ordered-Water#statement",
                  score: 0,
                  children: [],
                },
              },
            },
          },
        },
      },
    ],
    code: 200,
    success: true,
  };
  return (
    <Tree
      showLine={true}
      defaultExpandedKeys={["0-0-0"]}
      onSelect={onSelect}
      //   treeData={treeData}
    >
      {treesList && renderTreeNodes(treesList)}
    </Tree>
  );
};

export default CampTree;
