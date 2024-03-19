// import { useSelector } from "react-redux";
import Search from ".";
import { render, screen, waitFor } from "../../../utils/testUtils";
import CampSearch from "./camp";
import CampStatementSearch from "./campStatement";
import NicknameSearch from "./nickname";
import TopicSearch from "./topic";

// const mockState = {
//   camp: [
//     {
//       name: "abc",
//     },
//   ],
//   // dragBox,
//   // disabledCreateFolderBtn,
// };
//   jest.mock("react-redux", () => ({
//     ...jest.requireActual("react-redux"),
//     useSelector: jest.fn().mockImplementation(() => {
//       return {
//         searchData: {
//             camp: [{
//                 breadcrumbs:{type_value:"abc"},
//                 link:"/topic",
//                 type_value:"ABC"
//             }],
//             nickname:[{
//                 link:"/topic",
//                 type_value:"ABC"
//             }],
//             statement:[{
//                 breadcrumbs:{type_value:"abc"},
//                 link:"/topic",
//                 type_value:"ABC"
//             }],
//             topic:[{
//                 link:"/topic",
//                 type_value:"ABC"
//             }]
//         },
//       };
//     }),
//   }));

describe("Search heading", () => {
  it("render camp search heading", () => {
    render(<CampSearch />);
    const campHeading = screen.getByTestId("camp_heading");
    expect(campHeading).toBeInTheDocument();
  });
  it("render camp statement search heading", () => {
    render(<CampStatementSearch />);
    const campHeading = screen.getByTestId("camp_statment_heading");
    expect(campHeading).toBeInTheDocument();
  });
  it("render all search heading", async () => {
    render(<Search />);
    const allTopicHeading = screen.getByTestId("all_topic_heading");
    const allNickNameHeading = screen.getByTestId("all_nick_name_heading");
    const allCampHeading = screen.getByTestId("all_camp_heading");
    const allCampStatementHeading = screen.getByTestId(
      "all_camp_statement_heading"
    );

    await waitFor(() => {
      expect(allTopicHeading).toBeInTheDocument();
      expect(allNickNameHeading).toBeInTheDocument();
      expect(allCampHeading).toBeInTheDocument();
      expect(allCampStatementHeading).toBeInTheDocument();
    });
  });
  it("render nick name search heading", () => {
    render(<NicknameSearch />);
    const campHeading = screen.getByTestId("nickname_heading");
    expect(campHeading).toBeInTheDocument();
  });
  it("render topic search heading", () => {
    render(<TopicSearch />);
    const campHeading = screen.getByTestId("topic_heading");
    expect(campHeading).toBeInTheDocument();
  });
});
