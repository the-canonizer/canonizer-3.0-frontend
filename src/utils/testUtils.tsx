import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../store";

function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

const reduxRender = (ui, options) =>
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

export * from "@testing-library/react";
export { reduxRender as render };
