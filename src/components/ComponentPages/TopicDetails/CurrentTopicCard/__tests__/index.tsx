import CurrentTopicCard from "../";
import { cleanup, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";

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

// export function createMockRouter() {
//   return {
//     basePath: "/",
//     pathname: "/topic/34-Software-Development-Team-RFP/1-Agreement",
//     route: "/topic/34-Software-Development-Team-RFP/1-Agreement",
//     query: {
//       camp: ["34-Software-Development-Team-RFP", "1-Agreement"],
//     },
//     asPath: "/",
//     isReady: true,
//     defaultLocale: "en",
//     domainLocales: [],
//     isPreview: false,
//   };
// }

afterEach(cleanup);
windowMatchMedia();

describe("CurrentTopicCard on camp details page", () => {
  it("Should render without crash", () => {
    // const router = createMockRouter();
    render(
      // <RouterContext.Provider value={router}>
      <Provider store={store}>
        <CurrentTopicCard loadingIndicator={undefined} />
      </Provider>
      // </RouterContext.Provider>
    );
  });
});
