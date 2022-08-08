import CampInfoBar from "..";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";

afterEach(cleanup);
const payload = {
  camp_num: 1,
  topic_num: 88,
  topic_name: "Theories-of-Consciousness",
};
describe("Camp statement on camp details page", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <CampInfoBar payload={payload} isTopicPage={true} />
      </Provider>
    );
    const forumButton = screen.getByRole("button", {
      name: /camp forum/i,
    });

    expect(screen.getByText(/topic/i)).toBeInTheDocument();
    // expect(screen.getByText(/Theories-of-Consciousness/i)).toBeInTheDocument();
    expect(screen.getByText(/camp :/i)).toBeInTheDocument();
    expect(container.getElementsByTagName("button")).toHaveLength(1);
    expect(forumButton.textContent).toBe("Camp Forum");
  });
});
