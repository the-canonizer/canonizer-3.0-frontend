export const mockData = {
  1: {
    topic_id: 16,
    camp_id: 1,
    title: "Friendly AI Importance",
    score: 19,
    full_score: 20,
    submitter_nick_id: 1,
    created_date: 1179978965,
    color: "#cccccc",
    children: {
      8: {
        topic_id: 16,
        camp_id: 8,
        title: "Will Surpass current humans",
        score: 18,
        full_score: 19,
        submitter_nick_id: 1,
        created_date: 1600537982,
        children: {
          3: {
            topic_id: 16,
            camp_id: 3,
            title: "Such Concern Is Mistaken",
            score: 11.25,
            full_score: 12,
            submitter_nick_id: 1,
            created_date: 1600538246,
            children: {
              2: {
                topic_id: 16,
                camp_id: 2,
                title: "AI can only be friendly",
                score: 2,
                full_score: 2,
              },
              4: {
                topic_id: 16,
                camp_id: 4,
                title: "Concept not relevant",
                score: 8,
                full_score: 8,
                children: {
                  5: {
                    topic_id: 16,
                    camp_id: 5,
                    title: "NOT Products of Evolution",
                    score: 2,
                    full_score: 2,
                  },
                },
              },
              7: {
                topic_id: 16,
                camp_id: 7,
                title: "FriendlyAI",
                score: 1.25,
                full_score: 2,
                children: [],
              },
            },
          },
          9: {
            topic_id: 16,
            camp_id: 9,
            title: "FriendlyAIisSensible",
            score: 6.75,
            full_score: 7,
            children: {
              6: {
                topic_id: 16,
                camp_id: 6,
                title: "Friendliness is shorthand",
                score: 3,
                full_score: 3,
                submitter_nick_id: 188,
                created_date: 1283047491,
                children: [],
              },
              10: {
                topic_id: 16,
                camp_id: 10,
                title: "FriendlyAImayBeImpossible",
                score: 1,
                full_score: 1,
                children: [],
              },
              11: {
                topic_id: 16,
                camp_id: 11,
                title: "We must lead by example",
                score: 1,
                full_score: 1,
                children: [],
              },
            },
          },
        },
      },
    },
  },
};

// const  mockData = {
//     1: {
//       topic_id: 16,
//       camp_id: 1,
//       title: "Friendly AI Importance",
//       score: 19,
//       full_score: 20,
//       submitter_nick_id: 1,
//       created_date: 1179978965,
//       children: {
//         8: {
//           topic_id: 16,
//           camp_id: 8,
//           title: "Will Surpass current humans",
//           score: 18,
//           full_score: 19,
//           submitter_nick_id: 1,
//           created_date: 1600537982,
//           children: {
//             3: {
//               topic_id: 16,
//               camp_id: 3,
//               title: "Such Concern Is Mistaken",
//               score: 11.25,
//               full_score: 12,
//               submitter_nick_id: 1,
//               created_date: 1600538246,
//               children: {
//                 2: {
//                   topic_id: 16,
//                   camp_id: 2,
//                   title: "AI can only be friendly",
//                   score: 2,
//                   full_score: 2,
//                 },
//                 4: {
//                   topic_id: 16,
//                   camp_id: 4,
//                   title: "Concept not relevant",
//                   score: 8,
//                   full_score: 8,
//                   children: {
//                     5: {
//                       topic_id: 16,
//                       camp_id: 5,
//                       title: "NOT Products of Evolution",
//                       score: 2,
//                       full_score: 2,
//                     },
//                   },
//                 },
//                 7: {
//                   topic_id: 16,
//                   camp_id: 7,
//                   title: "FriendlyAI",
//                   score: 1.25,
//                   full_score: 2,
//                   children: [],
//                 },
//               },
//             },
//             9: {
//               topic_id: 16,
//               camp_id: 9,
//               title: "FriendlyAIisSensible",
//               score: 6.75,
//               full_score: 7,
//               children: {
//                 6: {
//                   topic_id: 16,
//                   camp_id: 6,
//                   title: "Friendliness is shorthand",
//                   score: 3,
//                   full_score: 3,
//                   submitter_nick_id: 188,
//                   created_date: 1283047491,
//                   children: [],
//                 },
//                 10: {
//                   topic_id: 16,
//                   camp_id: 10,
//                   title: "FriendlyAImayBeImpossible",
//                   score: 1,
//                   full_score: 1,
//                   children: [],
//                 },
//                 11: {
//                   topic_id: 16,
//                   camp_id: 11,
//                   title: "We must lead by example",
//                   score: 1,
//                   full_score: 1,
//                   children: [],
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   };

//   // console.log( ...Object.values(mockData))

//   var foo = {
//     bar:'a',
//     child:{
//       b: 'b',
//       grand:{
//         greatgrand: {
//           c:'c'
//         }
//       }
//     }
//   }

//   // use this recursive function with a parse function
//   function parseObjectProperties (obj, parse) {
//       // console.log(Object.values(obj))
//     for (var k in obj) {
//       if (typeof obj[k] === 'object' && obj[k] !== null) {
//       //   console.log(obj[k])
//         parseObjectProperties(obj[k], parse)
//       } else if (obj.hasOwnProperty(k)) {
//         parse(k, obj[k])
//       }
//     }
//   }
//   //***

//   // then apply to the property the task you want, in this case just console
//   parseObjectProperties(mockData, function(k, prop) {
//   //   console.log(k + ': ' + prop)
//     if(k=='score' || k=='title') console.log(k + ': ' + prop)
//   })
