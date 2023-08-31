import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "src/utils/testUtils";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";

import SubscriptionList from "../";

import {
  GetAllSubscriptionsList,
  // unsubscribeTopicOrCampAPI,
} from "src/network/api/userApi";
import { Provider } from "react-redux";

const subsList = [
  {
    topic_num: 323,
    title: "topic one 17 05",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [],
  },
  {
    topic_num: 324,
    title: "topic two",
    title_link:
      "http://canonizer3.local/topic/323-topic-one-17-05/1-Aggreement",
    camps: [
      {
        camp_num: 4,
        camp_name: "Agreement",
        support_order: 1,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
      {
        camp_num: 5,
        camp_name: "Agreement-2",
        support_order: 2,
        camp_link:
          "http://canonizer3.local/topic/323-topic-one-17-05/1-Agreement#statement",
      },
    ],
  },
];

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

jest.mock("src/network/api/userApi");

describe("Subscriptions List Component", () => {
  beforeEach(() => {
    jest.mock("src/network/api/userApi");
  });
  it("render heading and labels", () => {
    render(<SubscriptionList isTestData={subsList} />);
    waitFor(async () => {
      expect(screen.getAllByText("For topic").length).toEqual(2);
      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText(subsList[1].title)).toBeInTheDocument();
      expect(screen.getAllByText("Remove subscription").length).toEqual(2);
      expect(screen.getByText("Agreement")).toBeInTheDocument();
      expect(screen.getByText("Agreement-2")).toBeInTheDocument();
    });
  });

  it("click on remove subscription button and open modal", () => {
    render(<SubscriptionList isTestData={subsList} />);
    waitFor(async () => {
      const btns = screen.getAllByText("Remove subscription");

      userEvent.click(btns[0]);

      expect(screen.getByText(subsList[0].title)).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });

  it("data render", async () => {
    GetAllSubscriptionsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          {
            topic_num: 69,
            title: "Public Sex Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 295,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 294,
              },
            ],
          },
          {
            topic_num: 70,
            title: "Public Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 296,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 204,
              },
            ],
          },
        ],
      },
    });

    render(
      <Provider store={store1}>
        <SubscriptionList isTestData={subsList} />
      </Provider>
    );

    await waitFor(async () => {
      expect(GetAllSubscriptionsList).toHaveBeenCalled();
      expect(screen.getByText("Public Sex Education")).toBeInTheDocument();
      expect(screen.getAllByText("Funds for Sex Ed Before obama")).toHaveLength(
        2
      );
      expect(screen.getByText("Public Education")).toBeInTheDocument();
      expect(screen.getByText("Remove Subscription")).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
  it("data render camp remove", async () => {
    GetAllSubscriptionsList.mockResolvedValue({
      status_code: 200,
      data: {
        items: [
          {
            topic_num: 69,
            title: "Public Sex Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 295,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 294,
              },
            ],
          },
          {
            topic_num: 70,
            title: "Public Education",
            title_link:
              "http://localhost:4000/topic/69-Public-Sex-Education/1-Agreement",
            is_remove_subscription: true,
            subscription_id: 296,
            camps: [
              {
                camp_num: 11,
                camp_name: "Funds for Sex Ed Before obama",
                camp_link:
                  "http://localhost:4000/topic/69-Public-Sex-Education/11-Funds-for-Sex-Ed-Before-obama",
                subscription_start: "1678449914",
                subscription_id: 204,
              },
            ],
          },
        ],
      },
    });

    render(
      <Provider store={store1}>
        <SubscriptionList isTestData={subsList} />
      </Provider>
    );

    await waitFor(async () => {
      expect(GetAllSubscriptionsList).toHaveBeenCalled();
      expect(screen.getByText("Public Sex Education")).toBeInTheDocument();
      expect(screen.getAllByText("Funds for Sex Ed Before obama")).toHaveLength(
        2
      );
      expect(screen.getByText("Public Education")).toBeInTheDocument();
      expect(screen.getByText("Remove Subscription")).toBeInTheDocument();
      const closeCircle = screen.getAllByRole("img");
      expect(closeCircle).toHaveLength(5);
      fireEvent.click(closeCircle[0]);
      expect(screen.getByText("Remove")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
});
