import { render, screen } from "@testing-library/react";
import HomePageContainer from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

jest.mock("../../../../hooks/isUserAuthenticated", () => ({
  __esModule: true,
  default: jest.fn(() => ({ isUserAuthenticated: true })),
}));

describe("HomePageContainer", () => {
  test("renders SideBar component", () => {
    render(<HomePageContainer />);
    const sideBarElement = screen.getByTestId("sideBar");
    expect(sideBarElement).toBeInTheDocument();
  });

  test("renders TopicsList component", () => {
    render(<HomePageContainer />);
    const topicsListElement = screen.getByTestId("topicsList");
    expect(topicsListElement).toBeInTheDocument();
  });

  test("renders RecentActivities component when user is authenticated", () => {
    render(<HomePageContainer />);
    const recentActivitiesElement = screen.getByTestId("recentActivities");
    expect(recentActivitiesElement).toBeInTheDocument();
  });

  test("does not render RecentActivities component when user is not authenticated", () => {
    jest.mock("../../../../hooks/isUserAuthenticated", () => ({
      __esModule: true,
      default: jest.fn(() => ({ isUserAuthenticated: false })),
    }));

    render(<HomePageContainer />);
    const recentActivitiesElement = screen.queryByTestId("recentActivities");
    expect(recentActivitiesElement).toBeNull();
  });

  test("renders HelpCard component", () => {
    render(<Provider store={store}> <HomePageContainer /></Provider>);
    const helpCardElement = screen.getByTestId("helpCard");
    expect(helpCardElement).toBeInTheDocument();
  });

});
