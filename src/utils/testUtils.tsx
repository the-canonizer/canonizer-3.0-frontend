import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { jest } from "@jest/globals";
import { store } from "../store";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));


function ReduxProvider({ children }: any) {
  return <Provider store={store}>{children}</Provider>;
}

const reduxRender = (ui, options = null) =>
  render(ui, { wrapper: ReduxProvider, ...options });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const windowMatchMedia = () => {
  // return (window.matchMedia =
  //   window.matchMedia ||
  //   function () {
  //     return {
  //       matches: false,
  //       addListener: function () {},
  //       removeListener: function () {},
  //     };
  //   });
};

export * from "@testing-library/react";
export { reduxRender as render };
export { windowMatchMedia };
