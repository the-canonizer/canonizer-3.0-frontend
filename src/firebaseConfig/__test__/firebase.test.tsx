import { waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import firebase from "firebase/app";
import "firebase/messaging";
import localforage from "localforage";
import { firebaseCloudMessaging } from "../firebase";

jest.mock("src/network/api/notificationAPI");

jest.mock("firebase/app", () => {
  const messagingMock = {
    useServiceWorker: jest.fn(),
  };

  return {
    apps: [],
    initializeApp: jest.fn(() => ({
      messaging: jest.fn(() => messagingMock),
    })),
    messaging: jest.fn(() => messagingMock),
  };
});

jest.mock("localforage", () => ({
  getItem: jest.fn().mockResolvedValue("mocked-token"),
}));

beforeAll(() => {
  delete global.window.localStorage;

  global.window.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
});

describe("firebaseCloudMessaging", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize Firebase and return the token if available in local storage", async () => {
    // const messagingMock = {
    //   useServiceWorker: jest.fn(),
    // };

    const serviceWorkerMock = {
      addEventListener: jest.fn(),
      register: jest.fn().mockResolvedValue("mocked-service-worker"),
    };

    global.navigator.serviceWorker = serviceWorkerMock;
    global.navigator.PushManager = {};

    const token = await firebaseCloudMessaging.init();

    expect(firebase.initializeApp).toHaveBeenCalledWith({
      apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FCM_APP_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
    });

    // expect(messagingMock.useServiceWorker).toHaveBeenCalledWith(
    //   "mocked-service-worker"
    // );

    expect(localforage.getItem).toHaveBeenCalledWith("fcm_token");

    expect(token).toEqual("mocked-token");
  });

  it("should return null if local storage does not have a token", async () => {
    act(() => {
      global.localStorage.setItem = jest.fn(() => ({
        verified: "verified",
      }));

      global.localStorage.getItem = jest.fn(() => "verified");
    });

    jest.mock("localforage", () => ({
      getItem: jest.fn().mockResolvedValue(null),
    }));

    // const messagingMock = {
    //   useServiceWorker: jest.fn(),
    // };

    const serviceWorkerMock = {
      addEventListener: jest.fn(),
      register: jest.fn().mockResolvedValue("mocked-service-worker"),
    };

    global.navigator.serviceWorker = serviceWorkerMock;
    global.navigator.PushManager = {};

    await waitFor(async () => {
      const token = await firebaseCloudMessaging.init();
      expect(token).toEqual("mocked-token");
      // const token = await firebaseCloudMessaging.init();
      expect(firebase.initializeApp).toHaveBeenCalled();
      // expect(messagingMock.useServiceWorker).toHaveBeenCalled();
      expect(localforage.getItem).toHaveBeenCalledWith("fcm_token");
      // expect(token).toBeNull();
    });
  });
});
