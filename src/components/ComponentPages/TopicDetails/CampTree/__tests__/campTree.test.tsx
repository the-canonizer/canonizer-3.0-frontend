import CampTree from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { setTree } from "../../../../../store/slices/campDetailSlice";
import configureStore from "redux-mock-store";
import React from "react";
import { act } from "react-dom/test-utils";

afterEach(cleanup);

describe("Camp tree on camp details page", () => {
  it("Should render without crash", () => {
    const refMock = { current: null }; // Mock the ref object
    render(
      <Provider store={store}>
        <CampTree prevTreeValueRef={refMock} />
      </Provider>
    );
  });

  test("renders CampTree component correctly", () => {
    render(
      <Provider store={store}>
        <CampTree />
      </Provider>
    );
    expect(screen.getByTestId("camp-tree")).toBeInTheDocument();
    expect(screen.getByText("No Camp Tree Found")).toBeInTheDocument();
  });

  test("expands tree nodes correctly", () => {
    act(() => {
      store.dispatch(
        setTree([
          {
            "1": {
              topic_id: 988,
              camp_id: 1,
              title: "test today aa",
              review_title: "test today aa",
              link: "/topic/988-test-today-aa/1-Agreement",
              review_link: "/topic/988-test-today-aa/1-Agreement",
              score: 1,
              full_score: 1,
              submitter_nick_id: 4,
              created_date: 1691749153,
              is_valid_as_of_time: true,
              is_disabled: 0,
              is_one_level: 0,
              is_archive: 0,
              direct_archive: 0,
              subscribed_users: [],
              support_tree: [
                {
                  score: 1,
                  support_order: 1,
                  nick_name: "Andrea_Allsop",
                  nick_name_id: 4,
                  nick_name_link:
                    "/user/supports/4?topicnum=988&campnum=1&namespace=19",
                  delegates: [],
                  full_score: 1,
                },
              ],
              children: [],
              collapsedTreeCampIds: [1],
            },
          },
        ])
      );
    });
    let container;
    act(() => {
      container = render(
        <Provider store={store}>
          <CampTree
            treeExpandValue={50}
            prevTreeValueRef={{ current: 50 }}
            setSupportTreeForCamp={jest.fn()}
            setTotalCampScoreForSupportTree={jest.fn()}
            scrollToCampStatement={jest.fn()}
          />
        </Provider>
      );
    });

    expect(container.container.getElementsByTagName("a")).toHaveLength(2);
    expect(
      screen.getByRole("link", {
        name: /test today aa/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/1\.00/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /<start new supporting camp here>/i,
      })
    ).toBeInTheDocument();
  });
});
