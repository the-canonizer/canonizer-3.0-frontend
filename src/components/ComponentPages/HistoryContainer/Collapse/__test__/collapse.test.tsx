import { render, screen, fireEvent } from "@testing-library/react";
import HistoryCollapse from "../index";
import { Provider } from "react-redux";
import { store } from "src/store";

describe("HistoryCollapse component", () => {
  const mockCampStatement = {
    id: 1,
    status: "live",
    camp_name: "Test Camp",
    topic_name: "Test Topic",
    parsed_value: "<p>Test statement</p>",
    grace_period: true,
    submit_time: 1622879541,
  };

  test("renders camp statement history", () => {
    render(
      <Provider store={store}>
        {" "}
        <HistoryCollapse
          campStatement={mockCampStatement}
          topicNamespaceId={1}
        />
      </Provider>
    );

    const statementHistory = screen.getByText("Select To Compare");
    console.log("statementHistory", statementHistory);
    expect(statementHistory).toBeInTheDocument();

    const statement = screen.getByText("Select To Compare");
    expect(statement).toBeInTheDocument();
  });

  // test("displays 'Object' button when status is 'in_review'", () => {
  //   const inReviewCampStatement = { ...mockCampStatement, status: "in_review" };
  //   render(
  //     <Provider store={store}>
  //       {" "}
  //       <HistoryCollapse
  //         campStatement={inReviewCampStatement}
  //         topicNamespaceId={1}
  //       />
  //     </Provider>
  //   );

  //   const objectButton = screen.getByText("Object");
  //   expect(objectButton).toBeInTheDocument();
  // });

  // test("displays 'Submit Camp Update Based On This' button for camp history", () => {
  //   const campHistoryStatement = { ...mockCampStatement, status: "in_review" };
  //   render(
  //     <Provider store={store}>
  //       {" "}
  //       <HistoryCollapse
  //         campStatement={campHistoryStatement}
  //         topicNamespaceId={1}
  //       />
  //     </Provider>
  //   );

  //   const submitButton = screen.getByText("Submit Camp Update Based On This");
  //   expect(submitButton).toBeInTheDocument();
  // });

  // test("calls 'onSelectCompare' function when 'Select To Compare' checkbox is clicked", () => {
  //   const onSelectCompare = jest.fn();
  //   render(
  //     <Provider store={store}>
  //       <HistoryCollapse
  //         campStatement={mockCampStatement}
  //         topicNamespaceId={1}
  //         onSelectCompare={onSelectCompare}
  //       />
  //     </Provider>
  //   );

  //   const checkbox = screen.getByLabelText("Select To Compare");
  //   fireEvent.click(checkbox);
  //   expect(onSelectCompare).toHaveBeenCalledTimes(1);
  //   expect(onSelectCompare).toHaveBeenCalledWith(mockCampStatement);
  // });
});

// import HistoryCollapse from "..";
// import { render, cleanup, screen } from "@testing-library/react";
// import { RouterContext } from "next/dist/shared/lib/router-context";
// import { Provider } from "react-redux";
// import { store } from "../../../../../store";

// function createMockRouter() {
//   return {
//     basePath: "",
//     pathname: "/",
//     route: "/",
//     query: {},
//     asPath: "/",
//     back: jest.fn(),
//     beforePopState: jest.fn(),
//     prefetch: jest.fn(),
//     push: jest.fn(),
//     reload: jest.fn(),
//     replace: jest.fn(),
//     events: {
//       on: jest.fn(),
//       off: jest.fn(),
//       emit: jest.fn(),
//     },
//     isFallback: false,
//     isLocaleDomain: false,
//     isReady: true,
//     defaultLocale: "en",
//     domainLocales: [],
//     isPreview: false,
//   };
// }

// afterEach(cleanup);

// describe("CampHistory Page", () => {
//   it("should render without crash", () => {
//     const { container } = render(
//       <Provider store={store}>
//         <RouterContext.Provider value={createMockRouter()}>
//           <HistoryCollapse />
//         </RouterContext.Provider>
//       </Provider>
//     );
//   });
// });
