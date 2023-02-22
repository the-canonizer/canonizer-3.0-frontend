import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

jest.isolateModules(() => {
  const preloadAll = require("jest-next-dynamic");
  beforeAll(async () => {
    await preloadAll();
  });
});

jest.mock("next/router", () => require("next-router-mock"));
// jest.mock("next/router", () => ({
//   __esModule: true,
//   useRouter: jest.fn(),
// }));
// jest.mock(
//   "next/link",
//   () =>
//     ({ children }: any) =>
//       children
// );
