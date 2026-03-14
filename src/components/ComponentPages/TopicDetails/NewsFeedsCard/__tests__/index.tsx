import NewsFeedsCard from "..";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

import configureMockStore from "redux-mock-store";

afterEach(cleanup);

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

  forum: {
    currentThread: null,
    currentPost: null,
  },
});

describe("NewsFeedsCard on camp details page", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <NewsFeedsCard newsFeed={[]} />
      </Provider>
    );

    expect(screen.getByText(/news feeds/i)).toBeInTheDocument();
    expect(screen.getByText(/No News Found/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("textarea")).toHaveLength(0);
    expect(container.getElementsByTagName("input")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(0);
  });

  it("newfeed exist", () => {
    const { container } = render(
      <Provider store={store}>
        <NewsFeedsCard
          newsFeed={[
            {
              id: 197,
              display_text: "test1",
              link: "www.google.com/",
              available_for_child: 0,
              submitter_nick_name: "Sajid-Dev",
              submit_time: 1694521946,
              owner_flag: true,
              manage_flag: true,
              parent_camp_name: null,
              parent_camp_url: null,
            },
            {
              id: 198,
              display_text: "test2",
              link: "www.abcd.com/",
              available_for_child: 0,
              submitter_nick_name: "Sajid-Dev",
              submit_time: 1694521946,
              owner_flag: true,
              manage_flag: true,
              parent_camp_name: null,
              parent_camp_url: null,
            },
          ]}
        />
      </Provider>
    );
    expect(screen.getByText(/news feeds/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sajid-dev/i)).toHaveLength(2);
    expect(screen.getAllByText(/\(by \)/i)).toHaveLength(2);
    expect(
      screen.getByRole("link", {
        name: /test1/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /test2/i,
      })
    ).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(0);
    expect(container.getElementsByTagName("a")).toHaveLength(2);
  });
  it("newfeed exist admin", async () => {
    const { container } = render(
      <Provider store={store1}>
        <NewsFeedsCard
          newsFeed={[
            {
              id: 197,
              display_text: "test1",
              link: "www.google.com/",
              available_for_child: 0,
              submitter_nick_name: "Sajid-Dev",
              submit_time: 1694521946,
              owner_flag: true,
              manage_flag: true,
              parent_camp_name: null,
              parent_camp_url: null,
            },
            {
              id: 198,
              display_text: "test2",
              link: "www.abcd.com/",
              available_for_child: 0,
              submitter_nick_name: "Sajid-Dev",
              submit_time: 1694521946,
              owner_flag: true,
              manage_flag: true,
              parent_camp_name: null,
              parent_camp_url: null,
            },
          ]}
        />
      </Provider>
    );
    expect(screen.getByText(/news feeds/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", {
        name: /edit news/i,
      })
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("button", {
        name: /delete news/i,
      })
    ).toHaveLength(2);
    expect(screen.getAllByText(/sajid-dev/i)).toHaveLength(2);
    expect(screen.getAllByText(/\(by \)/i)).toHaveLength(2);
    expect(
      screen.getByRole("link", {
        name: /test1/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /test2/i,
      })
    ).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(2);
    expect(container.getElementsByTagName("a")).toHaveLength(2);
    fireEvent.click(
      screen.getAllByRole("button", {
        name: /edit news/i,
      })[1]
    );
    await waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/cancel/i));
    await waitFor(() => {
      expect(
        screen.getAllByRole("button", {
          name: /edit news/i,
        })
      ).toHaveLength(2);
      expect(
        screen.getAllByRole("button", {
          name: /delete news/i,
        })
      ).toHaveLength(2);
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: /edit news/i,
      })[1]
    );
    await waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/cancel/i)).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: /edit/i,
      })
    ).toHaveLength(2);

    fireEvent.click(
      screen.getAllByRole("button", {
        name: /edit/i,
      })[1]
    );
  });

  it("newfeed exist admin fire delete", async () => {
    render(
      <Provider store={store1}>
        <NewsFeedsCard
          newsFeed={[
            {
              id: 197,
              display_text: "test1",
              link: "www.google.com/",
              available_for_child: 0,
              submitter_nick_name: "Sajid-Dev",
              submit_time: 1694521946,
              owner_flag: true,
              manage_flag: true,
              parent_camp_name: null,
              parent_camp_url: null,
            },
            {
              id: 198,
              display_text: "test2",
              link: "www.abcd.com/",
              available_for_child: 0,
              submitter_nick_name: "Sajid-Dev",
              submit_time: 1694521946,
              owner_flag: true,
              manage_flag: true,
              parent_camp_name: null,
              parent_camp_url: null,
            },
          ]}
        />
      </Provider>
    );
    fireEvent.click(
      screen.getAllByRole("button", {
        name: /delete news/i,
      })[1]
    );
    await waitFor(() => {
      expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", {
        name: /delete/i,
      })
    ).toHaveLength(2);
    fireEvent.click(
      screen.getAllByRole("button", {
        name: /delete/i,
      })[1]
    );
  });
});
