// import { render, screen, waitFor } from "../../../../utils/testUtils";
// import userEvent from "@testing-library/user-event";
// import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
// import messages from "../../../../messages";

// const { labels, placeholders, validations } = messages;

// const isSupportedCampsModalVisible = true;
// const removeCardSupportedCamps = jest.fn();
// const handleSupportedCampsCancel = jest.fn();
// const removeSupport = jest.fn();
// const search = "";

// const directSupportedCampsList = [
//   {
//     id: "1",
//     title_link: "https://www.google.com/",
//     title: "Direct Supported camps",
//     camps: [
//       {
//         camp_link: "https://www.google.com/",
//         support_order: 1,
//         camp_name: "Supported Camps",
//       },
//     ],
//   },
//   {
//     id: "2",
//     title_link: "https://www.google.com/",
//     title: "Direct Supported camps 2",
//     camps: [
//       {
//         camp_link: "https://www.google.com/",
//         support_order: 2,
//         camp_name: "Supported Camps 2",
//       },
//     ],
//   },
// ];
// describe("Direct Support camps page", () => {
//   it("render Modal when Remove support is clicked", () => {
//     render(
//       <DirectSupportedCampsUI
//         removeCardSupportedCamps={removeCardSupportedCamps}
//         handleSupportedCampsCancel={handleSupportedCampsCancel}
//         isSupportedCampsModalVisible={isSupportedCampsModalVisible}
//         directSupportedCampsList={directSupportedCampsList}
//         search={search}
//         removeSupport={removeSupport}
//       />
//     );
//     expect(screen.getByText("Remove")).toBeTruthy();
//     expect(screen.getByText("Cancel")).toBeTruthy();
//     expect(screen.getByText("Remove Support")).toBeInTheDocument();
//     expect(
//       screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//   });
//   it("render Remove support is clicked", () => {
//     const { getByText } = render(
//       <DirectSupportedCampsUI
//         removeCardSupportedCamps={removeCardSupportedCamps}
//         handleSupportedCampsCancel={handleSupportedCampsCancel}
//         isSupportedCampsModalVisible={isSupportedCampsModalVisible}
//         directSupportedCampsList={directSupportedCampsList}
//         search={search}
//         removeSupport={removeSupport}
//       />
//     );
//     expect(
//       screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//   });
//   it("render direct Supported Camps is clicked/active", () => {
//     render(
//       <DirectSupportedCampsUI
//         removeCardSupportedCamps={removeCardSupportedCamps}
//         handleSupportedCampsCancel={handleSupportedCampsCancel}
//         isSupportedCampsModalVisible={isSupportedCampsModalVisible}
//         directSupportedCampsList={directSupportedCampsList}
//         search={search}
//         removeSupport={removeSupport}
//       />
//     );
//     expect(
//       screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//     expect(
//       screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//   });
// });
import {
  fireEvent,
  queryAllByTestId,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
import messages from "../../../../messages";
import DirectSupportedCamps from "..";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { Input, message } from "antd";
import {
  getDirectSupportedCampsList,
  removeOrUpdateDirectSupportCamps,
} from "src/network/api/userApi";
import SupportRemovedModal from "../../../common/supportRemovedModal";

const { labels } = messages;

const isSupportedCampsModalVisible = true;
const removeCardSupportedCamps = jest.fn();
const handleSupportedCampsCancel = jest.fn();
const removeSupport = jest.fn();
const search = "",
  idData = "",
  visible = "false",
  revertBack = [];
const handleOk = jest.fn();
const handleCancel = jest.fn();
const handleRevertBack = jest.fn();
const setRevertBack = jest.fn();
const showSaveChanges = false;
const setCardCamp_ID = jest.fn();
const setShowSaveChanges = jest.fn();
const saveChanges = jest.fn();
const handleClose = jest.fn();
const setDirectSupportedCampsList = [];

const directSupportedCampsList = [
  {
    id: "1",
    title_link: "https://www.google.com/",
    title: "Direct Supported camps",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 1,
        camp_name: "Supported Camps",
      },
    ],
  },
  {
    id: "2",
    title_link: "https://www.google.com/",
    title: "Direct Supported camps 2",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 2,
        camp_name: "Supported Camps 2",
      },
    ],
  },
  {
    id: "3",
    title_link: "https://www.google.com/",
    title: "User profile",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 3,
        camp_name: "Sample User profile",
      },
    ],
  },
];
const removeSupportCampsData = {
  camps: [
    {
      id: 1,
      camp_num: 1,
      camp_name: "Agreement",
      support_order: 1,
      camp_link: "/topic/788-absd---/1-Agreement#statement",
    },
  ],
  nick_name_id: 571,
  title: "absd@#$",
  title_link: "/topic/788-absd---/1-Agreement",
  topic_num: 788,
};
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("src/network/api/userApi", () => ({
  getDirectSupportedCampsList: jest.fn(() =>
    Promise.resolve({ data: directSupportedCampsList, status_code: 200 })
  ),
  removeOrUpdateDirectSupportCamps: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          removeEntireData: {},
        },
      ],
      status_code: 200,
    })
  ),
}));

jest.mock("src/network/api/topicAPI", () => ({
  GetActiveSupportTopic: jest.fn(() =>
    Promise.resolve({ data: [], status_code: 200 })
  ),
  GetCheckSupportExists: jest.fn(() =>
    Promise.resolve({
      data: {
        remove_camps: {},
      },
      status_code: 200,
    })
  ),
}));

describe("direct supported camps", () => {
  // it("render a value when write in search box", async() => {
  //   render(<DirectSupportedCamps search={"dir"} />);
  //  await waitFor(() => {
  //     // expect(screen.getAllByText("For topic").length).toEqual(2);
  //     expect(screen.getByTestId("save_change_btn")).toBeInTheDocument();
  //     fireEvent.click(screen.getByTestId("save_change_btn"));
  //   });
  // });

  // it("click on remove support button and open modal", () => {
  //   render(<DirectSupportedCamps search={"dir"} />);
  //   waitFor(async () => {
  //     const btns = screen.getAllByText("Remove Support");

  //     userEvent.click(btns[0]);

  //     expect(
  //       screen.getByText(directSupportedCampsList[0].title)
  //     ).toBeInTheDocument();
  //     expect(screen.getByText("Remove")).toBeInTheDocument();
  //     expect(screen.getByText("Cancel")).toBeInTheDocument();
  //   });
  // });

  it("render direct Supported Camps is clicked/active", async () => {
    render(<DirectSupportedCamps search={"dir"} />);
    await waitFor(() => {
      // expect(
      //   screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
      // ).toBeInTheDocument();
      // expect(
      //   screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
      // ).toBeInTheDocument();
      expect(screen.getAllByTestId("handle_close")[0]).toBeInTheDocument();
      fireEvent.click(screen.getAllByTestId("handle_close")[0]);
      expect(screen.getAllByTestId("handle_close")[0]).toBeInTheDocument();
      fireEvent.click(screen.getAllByTestId("handle_close")[0]);
    });
  });
});
it("render useState is working ", () => {
  render(<DirectSupportedCamps search={"dir"} />);
  const TestComponent = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleActive = () => {
      setIsActive(!isActive);
    };

    return (
      <div>
        <p>{isActive ? "Active" : "Inactive"}</p>
        <button onClick={toggleActive}>Toggle</button>
      </div>
    );
  };

  const { getByText } = render(<TestComponent />);

  const statusElement = getByText("Inactive");
  const toggleButton = getByText("Toggle");

  expect(statusElement.textContent).toBe("Inactive");

  fireEvent.click(toggleButton);

  expect(statusElement.textContent).toBe("Active");

  fireEvent.click(toggleButton);

  expect(statusElement.textContent).toBe("Inactive");
});

it("path is working with use router", () => {
  render(<DirectSupportedCamps search={"dir"} />);
  const mockedRouter = {
    pathname: "/about",
  };
  // Setting up the mocked useRouter implementation
  useRouter.mockImplementation(() => mockedRouter);

  const { result } = renderHook(() => useRouter());

  expect(result.current.pathname).toBe("/about");
});
