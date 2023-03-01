import * as nextRouter from "next/router";

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

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

describe("TopicsList Component", function () {
  it("should render without crash", function () {
    // let { getByText } = render(
    //   <Provider store={store}>
    //     <TopicsList />
    //   </Provider>
    // );
    // expect(getByText("Canonized list for")).toMatchInlineSnapshot(`
    //   <h3>
    //   Canonized list for
    //   </h3>
    // `);
  });
});
