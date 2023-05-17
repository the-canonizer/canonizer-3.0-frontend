import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { Provider } from "react-redux";
import { store } from "src/store";

import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "../../../../utils/testUtils";

import CreateNewCamp from "..";
import messages from "../../../../messages";

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

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn().mockReturnValue({
    asPath: "/camp/create/88-Theories-of-Consciousness/1-Agreement",
    query: { camp: ["88-Theories-of-Consciousness", "1-Agreement"] },
  }),
}));

function createMockRouter(router: Partial<NextRouter>): any {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: { camp: ["88-Theories-of-Consciousness", "1-Agreement"] },
    asPath: "/camp/create/88-Theories-of-Consciousness/1-Agreement",
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    ...router,
  };
}

afterEach(cleanup);

describe("Create New Topic page", () => {
  it("render heading and labels", () => {
    render(
      <Provider store={store}>
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp
            nickNames={nickNamesList}
            parentCamps={parentCampsList}
            campNickNames={campNickNamesList}
            initialValues={initialValues}
          />
        </RouterContext.Provider>
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
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp
            nickNames={nickNamesList}
            parentCamps={parentCampsList}
            campNickNames={campNickNamesList}
            initialValues={initialValues}
          />
        </RouterContext.Provider>
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
        <RouterContext.Provider value={createMockRouter({})}>
          <CreateNewCamp
            nickNames={nickNamesList}
            parentCamps={parentCampsList}
            campNickNames={campNickNamesList}
            initialValues={initialValues}
          />
        </RouterContext.Provider>
      </Provider>
    );
    const btnEl = screen.getByTestId("btn");

    fireEvent.click(btnEl);
    // eslint-disable-next-line jest/valid-expect
    expect(screen.queryByRole("alert"));
  });
});
