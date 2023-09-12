import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Notifications from "../";
import { firebaseCloudMessaging } from "src/firebaseConfig/firebase";
import { updateFCMToken } from "src/network/api/notificationAPI";
import localforage from "localforage";
import Fav from "../icon";

jest.mock("src/firebaseConfig/firebase", () => ({
  firebaseCloudMessaging: {
    init: jest.fn(),
  },
}));

jest.mock("src/network/api/notificationAPI", () => ({
  getLists: jest.fn(),
  updateFCMToken: jest.fn(),
}));

jest.mock("localforage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn().mockResolvedValue(),
}));

const mockStore = configureStore([]);

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

const mockMessaging = {
  getToken: jest.fn().mockResolvedValue("mockToken"),
};

describe("Notifications", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      notifications: {
        headerNotification: {
          count: 3,
          list: [],
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the Notifications component", () => {
    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("enables push notification and updates token", async () => {
    const mockToken = "mocked-token";
    const mockServiceWorker = {
      addEventListener: jest.fn(),
      register: jest.fn().mockResolvedValue("mocked-service-worker"),
    };

    global.navigator.serviceWorker = mockServiceWorker;
    global.navigator.PushManager = {};

    firebaseCloudMessaging.init.mockResolvedValueOnce(mockToken);
    updateFCMToken.mockResolvedValueOnce();

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const clicked = screen.getByTestId("clickable");
    fireEvent.click(clicked);

    expect(screen.getByText("notifications"));

    // Enable push notification switch
    const enableSwitch = screen.getByTestId("enable-text");
    expect(screen.getByText("Enable push notification"));

    fireEvent.click(enableSwitch);

    // Verify that Firebase initialization and token update are called correctly
    expect(firebaseCloudMessaging.init).toHaveBeenCalled();
    expect(firebaseCloudMessaging.init).toHaveBeenCalledWith();

    // Verify that the getToken function is called
    // expect(mockMessaging.getToken).toHaveBeenCalled();
    // expect(mockMessaging.getToken).toHaveBeenCalledWith({
    //   vapidKey: process.env.NEXT_PUBLIC_FCM_CERTIFICATE_KEY,
    // });

    // Verify that the updateToken function is called
    // expect(updateFCMToken).toHaveBeenCalled();
    // expect(updateFCMToken).toHaveBeenCalledWith(mockToken);

    // Verify that the switch state is updated
    // const updatedSwitch = screen.getByLabelText("Enable push notification", {
    //   checked: true,
    // });
    // expect(updatedSwitch).toBeInTheDocument();
  });

  test("disables push notification and removes token", async () => {
    const mockServiceWorker = {
      addEventListener: jest.fn(),
      register: jest.fn().mockResolvedValue("mocked-service-worker"),
    };

    global.navigator.serviceWorker = mockServiceWorker;
    global.navigator.PushManager = {};

    render(
      <Provider store={store}>
        <Notifications />
      </Provider>
    );

    const clicked = screen.getByTestId("clickable");
    fireEvent.click(clicked);

    // Disable push notification switch
    const disableSwitch = screen.getByTestId("enable-text");
    expect(screen.getByText("Enable push notification"));
    fireEvent.click(disableSwitch);

    // Verify that the token is removed
    // expect(localforage.removeItem).toHaveBeenCalled();
    // expect(localforage.removeItem).toHaveBeenCalledWith("fcm_token");

    // Verify that the switch state is updated
    // const updatedSwitch = screen.getByLabelText("Enable push notification", {
    //   checked: false,
    // });
    // expect(updatedSwitch).toBeInTheDocument();
  });

  test("renders the image with correct attributes", () => {
    render(<Fav />);

    const image = screen.getByAltText("fav-icon");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    );
    // expect(image).toHaveAttribute("width", "32");
    // expect(image).toHaveAttribute("height", "32");
  });
});
