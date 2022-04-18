import Footer from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { windowMatchMedia } from "../../../../utils/testUtils";

windowMatchMedia();

afterEach(cleanup);

describe("Footer", () => {
  it("Should render without crash", () => {
    const { container } = render(<Footer />);
    const logoLink = screen.getByRole("link", {
      name: "Canonizer",
    });
    const privacyPolicyLink = screen.getByRole("link", {
      name: /Privacy Policy/i,
    });
    const termsAndServicesLink = screen.getByRole("link", {
      name: /Terms & Services/i,
    });

    const browseLink = screen.getByRole("link", {
      name: /Browse/i,
    });
    const servicesLink = screen.getByRole("link", {
      name: "Services",
    });
    const createNewTopicLink = screen.getByRole("link", {
      name: /Create New Topic/i,
    });
    const helpLink = screen.getByRole("link", {
      name: /Help/i,
    });
    const uploadFilesLink = screen.getByRole("link", {
      name: /Upload Files/i,
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
    const supportingMailLink = screen.getByRole("link", {
      name: /support@canonizer.com/i,
    });

    screen.getByText((content, node) => {
      const hasText = (node) =>
        node.textContent ===
        "Copyright owned by the volunteers contributing to the system and its contents (2006 - 2022)";
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every(
        (child) => !hasText(child)
      );

      return nodeHasText && childrenDontHaveText;
    });

    expect(container.getElementsByTagName("footer")).toHaveLength(1);
    expect(container.getElementsByTagName("ul")).toHaveLength(2);
    expect(container.getElementsByTagName("li")).toHaveLength(10);
    expect(container.getElementsByTagName("a")).toHaveLength(12);
    expect(container.getElementsByTagName("img")).toHaveLength(4);

    expect(logoLink.getAttribute("href")).toBe("/");
    expect(browseLink.getAttribute("href")).toBe("/browse");
    expect(uploadFilesLink.getAttribute("href")).toBe("/uploadFile");
    expect(helpLink.getAttribute("href")).toBe("/help");
    expect(whitePaperLink.getAttribute("href")).toBe("/white-paper");
    expect(blogLink.getAttribute("href")).toBe("/blog");
    expect(jobsLink.getAttribute("href")).toBe("/jobs");
    expect(servicesLink.getAttribute("href")).toBe("/services");
    expect(termsAndServicesLink.getAttribute("href")).toBe(
      "/terms-and-services"
    );
    expect(privacyPolicyLink.getAttribute("href")).toBe("/privacy-policy");
    expect(createNewTopicLink.getAttribute("href")).toBe("/create/topic");
    expect(supportingMailLink.getAttribute("href")).toBe(
      "mailto:support@canonizer.com"
    );
  });
});
