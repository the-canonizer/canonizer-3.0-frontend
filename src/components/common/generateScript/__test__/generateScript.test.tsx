import { cleanup, render, screen } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import GenerateScript from "../";

// Create a mock store
const mockStore = configureMockStore();
const store1 = mockStore({
  auth: {
    authenticated: true,
    loggedInUser: {
      is_admin: true,
    },
  },
  topicDetails: {
    currentCampRecord: { parentCamps: [{ camp_name: "camp one" }] },
  },
  filters: {
    filterObject: {
      page_number: 1,
      page_size: 15,
      nameSpace: "/General/",
      namespace_id: 1,
      asofdate: Date.now() / 1000,
      asof: "default",
      filterByScore: 0,
      algorithm: "blind_popularity",
      search: "",
      includeReview: false,
      is_archive: 0,
    },
  },
  forum: {
    currentThread: {},
    currentPost: {},
  },
});

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
});

const originalLocation = window.navigator;

beforeAll(() => {
  delete global.window.navigator;
  global.window.navigator = {
    clipboard: { writeText: jest.fn((text) => Promise.resolve("copied!")) },
  };
});

afterAll(() => {
  global.window.navigator = originalLocation;
});

afterEach(cleanup);

describe("Generate Script Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("check social login links and text exists in page", async () => {
    render(
      <Provider store={store1}>
        <GenerateScript topic_num={undefined} camp_num={undefined} />
      </Provider>
    );
    expect(screen.getByText("Get Embed Code")).toBeInTheDocument();
    expect(screen.getByTestId("generate-btn")).toBeInTheDocument();

    const btn = screen.getByTestId("generate-btn");
    userEvent.click(btn);

    expect(screen.getByText("Copy Script")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();

    const copyBtn = screen.getByTestId("btn");
    userEvent.click(copyBtn);
  });
});
