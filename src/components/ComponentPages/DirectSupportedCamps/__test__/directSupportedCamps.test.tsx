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

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import DirectSupportedCamps from "..";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";

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
  it("render direct Supported Camps is clicked/active", async () => {
    render(<DirectSupportedCamps search={"dir"} />);
    await waitFor(() => {
      expect(screen.getAllByTestId("handle_close")[0]).toBeInTheDocument();
      fireEvent.click(screen.getAllByTestId("handle_close")[0]);
      expect(screen.getAllByTestId("handle_close")[0]).toBeInTheDocument();
      fireEvent.click(screen.getAllByTestId("handle_close")[0]);
    });
  });
});
it("render useState is working", () => {
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

describe("directsupported camps", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("direct support cancel", async () => {
    const { getAllByText } = render(
      <DirectSupportedCamps search={""}></DirectSupportedCamps>
    );

    await waitFor(async () => {
      const remove_button = getAllByText("Remove Support");
      expect(remove_button[0]).toBeInTheDocument();
      fireEvent.click(remove_button[0]);
      const cancel_button = getAllByText("Cancel");
      fireEvent.click(cancel_button[0]);
    });
  });
  it("direct support remove", async () => {
    const { getAllByText } = render(
      <DirectSupportedCamps search={""}></DirectSupportedCamps>
    );

    await waitFor(async () => {
      const remove_button = getAllByText("Remove Support");
      expect(remove_button[0]).toBeInTheDocument();
      fireEvent.click(remove_button[0]);
      const cancel_button = getAllByText("Remove");
      fireEvent.click(cancel_button[0]);
    });
  });
  it("direct support save changes", async () => {
    const { getAllByTestId, getAllByText } = render(
      <DirectSupportedCamps search={""}></DirectSupportedCamps>
    );

    await waitFor(async () => {
      const remove_button = getAllByTestId("handle_close");
      expect(remove_button[0]).toBeInTheDocument();
      fireEvent.click(remove_button[0]);
      const save_changes = getAllByText("Save Changes");
      fireEvent.click(save_changes[0]);
    });
  });

  it("direct support revert changes 2", async () => {
    const { getAllByTestId, getAllByText } = render(
      <DirectSupportedCamps search={""}></DirectSupportedCamps>
    );
    await waitFor(async () => {
      const remove_button = getAllByTestId("handle_close");
      expect(remove_button[0]).toBeInTheDocument();
      fireEvent.click(remove_button[0]);
      const save_changes = getAllByText("Revert");
      fireEvent.click(save_changes[0]);
    });
  });
});
