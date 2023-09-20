import { cleanup, render, screen, waitFor } from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "src/store";
import configureMockStore from "redux-mock-store";

import CreateNewCamp from "..";
import messages from "../../../../messages";

import { getAllUsedNickNames } from "src/network/api/campDetailApi";

const { labels } = messages;

const initialValues = {
  nick_name: 36,
  namespace: 1,
};

const nickNamesList = [
  {
    id: 36,
    nick_name: "Rahul-Singh775",
    create_time: "7963-03-24",
    owner_code: "TWFsaWEzNk1hbGlh",
    private: 0,
  },
  {
    id: 45,
    nick_name: "Redwin75",
    create_time: "7963-03-27",
    owner_code: "TWFsaWEzNk1hbGlh",
    private: 0,
  },
];

const parentCampsList = [
  {
    camp_name: "Design Change...",
    camp_num: 5,
    id: 119,
    parent_camp_num: 2,
    topic_num: 1,
  },
  {
    camp_name: "Second camp",
    camp_num: 7,
    id: 114,
    parent_camp_num: 4,
    topic_num: 4,
  },
];

const campNickNamesList = [
  { id: 20, nick_name: "Akash-Akash" },
  { id: 22, nick_name: "Rahul -Singh919" },
];

jest.mock("src/network/api/campDetailApi");

jest.mock("src/network/api/campDetailApi", () => ({
  createCamp: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: campNickNamesList })
  ),
  getAllParentsCamp: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: campNickNamesList })
  ),
  getAllCampNickNames: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: campNickNamesList })
  ),
  getAllUsedNickNames: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: campNickNamesList })
  ),
  getCampBreadCrumbApi: jest.fn(() =>
    Promise.resolve({ status_code: 200, data: campNickNamesList })
  ),
}));

const mockStore = configureMockStore();

afterEach(cleanup);

describe("Create Topic page", () => {
  beforeEach(() => {
    jest.mock("src/network/api/campDetailApi", () => ({
      createCamp: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: campNickNamesList })
      ),
      getAllParentsCamp: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: campNickNamesList })
      ),
      getAllCampNickNames: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: campNickNamesList })
      ),
      getAllUsedNickNames: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: campNickNamesList })
      ),
      getCampBreadCrumbApi: jest.fn(() =>
        Promise.resolve({ status_code: 200, data: campNickNamesList })
      ),
    }));
  });

  it("render heading and labels", () => {
    render(
      <Provider store={store}>
        <CreateNewCamp
          nickNames={nickNamesList}
          parentCamps={parentCampsList}
          campNickNames={campNickNamesList}
          initialValues={initialValues}
        />
      </Provider>
    );

    waitFor(async () => {
      expect(screen.getByTestId("head")).toBeInTheDocument();
      expect(screen.getByText(labels.cr_camp_name)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_keywords)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_edit_summary)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_keywords_sp)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_camp_url)).toBeInTheDocument();
      expect(screen.getByText(labels.cr_nick_name_about)).toBeInTheDocument();
      expect(screen.getByTestId("btn")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  it("render inputs field and submit button", () => {
    render(
      <Provider store={store}>
        <CreateNewCamp
          nickNames={nickNamesList}
          parentCamps={parentCampsList}
          campNickNames={campNickNamesList}
          initialValues={initialValues}
        />
      </Provider>
    );

    waitFor(async () => {
      const campName = screen.getByText(labels.cr_camp_name);
      expect(campName).toBeInTheDocument();
      expect(campName).toHaveAttribute("type", "text");

      const keywords = screen.getByText(labels.cr_keywords);
      expect(keywords).toBeInTheDocument();
      expect(keywords).toHaveAttribute("type", "text");

      const editSummary = screen.getByText(labels.cr_edit_summary);
      expect(editSummary).toBeInTheDocument();

      const campUrl = screen.getByText(labels.cr_camp_url);
      expect(campUrl).toBeInTheDocument();
      expect(campUrl).toHaveAttribute("type", "text");

      const nickNameAbout = screen.getByText(labels.cr_nick_name_about);
      expect(nickNameAbout).toBeInTheDocument();
      expect(nickNameAbout).toHaveAttribute("type", "search");
    });
  });

  it("blank form should not be submit", async () => {
    render(
      <Provider store={store}>
        <CreateNewCamp
          nickNames={nickNamesList}
          parentCamps={parentCampsList}
          campNickNames={campNickNamesList}
          initialValues={initialValues}
        />
      </Provider>
    );
    const btnEl = screen.getByTestId("btn");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).toBeInTheDocument();
    });
  });
  it("api call", async () => {
    getAllUsedNickNames.mockResolvedValue({
      status_code: 200,
      data: [{ id: 1, name: "Nickname 1" }],
    });

    const store1 = mockStore({
      auth: {
        authenticated: true,
        loggedInUser: {
          is_admin: true,
        },
      },
      topicDetails: {
        currentCampRecord: {},
      },
      filters: {
        filterObject: {},
      },
      forum: {
        currentThread: null,
        currentPost: null,
      },
    });

    render(
      <Provider store={store1}>
        <CreateNewCamp
          nickNames={nickNamesList}
          parentCamps={parentCampsList}
          campNickNames={campNickNamesList}
          initialValues={initialValues}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(getAllUsedNickNames).toHaveBeenCalled();
    });
  });
});
