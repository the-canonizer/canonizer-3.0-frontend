import LoggedOutHeader from "../";
import { cleanup, getByRole, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../../../store";
import { windowMatchMedia } from "../../../../../utils/testUtils";
windowMatchMedia();

afterEach(cleanup);

describe("LoggedOutHeader", () => {
  it("Should render without crash", () => {
    const { container } = render(
      <Provider store={store}>
        <LoggedOutHeader />
      </Provider>
    );
    const logoLink = screen.getByRole("link", {
      name: /Picture of the author/i,
    });
    const browseLink = screen.getByRole("link", {
      name: /Browse/i,
    });
    const uploadFilesLink = screen.getByRole("link", {
      name: /Upload Files/i,
    });

    const helpLink = screen.getByRole("link", {
      name: /Help/i,
    });

    const whitePaperLink = screen.getByRole("link", {
      name: /White Paper/i,
    });
    const blogLink = screen.getByRole("link", {
      name: /Blog/i,
    });
    const jobsLink = screen.getByRole("link", {
      name: /Jobs/i,
    });
    const servicesLink = screen.getByRole("link", {
      name: /Services/i,
    });

    expect(container.getElementsByTagName("header")).toHaveLength(1);
    expect(container.getElementsByTagName("nav")).toHaveLength(1);
    expect(container.getElementsByTagName("ul")).toHaveLength(1);
    expect(container.getElementsByTagName("li")).toHaveLength(7);
    expect(container.getElementsByTagName("a")).toHaveLength(8);
    expect(container.getElementsByTagName("button")).toHaveLength(8);
    expect(container.getElementsByTagName("img")).toHaveLength(1);

    expect(logoLink.getAttribute("href")).toBe("/");
    expect(browseLink.getAttribute("href")).toBe("/browse");
    expect(uploadFilesLink.getAttribute("href")).toBe("/upload");
    expect(helpLink.getAttribute("href")).toBe("/help");
    expect(whitePaperLink.getAttribute("href")).toBe("/white-paper");
    expect(blogLink.getAttribute("href")).toBe("/blog");
    expect(jobsLink.getAttribute("href")).toBe("/jobs");
    expect(servicesLink.getAttribute("href")).toBe("/services");
  });
});
