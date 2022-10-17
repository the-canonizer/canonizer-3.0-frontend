import Footer from "../";
import { cleanup, render, screen } from "@testing-library/react";
import { windowMatchMedia } from "../../../../utils/testUtils";
import { loadEnvConfig } from "@next/env";



const loadConfig = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

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

    const createNewTopicLink = screen.getByRole("link", {
      name: /Create New Topic/i,
    });
    const helpLink = screen.getByRole("link", {
      name: /Help/i,
    });
    const uploadFilesLink = screen.getByRole("link", {
      name: /Upload File/i,
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
    expect(container.getElementsByTagName("ul")).toHaveLength(3);
    expect(container.getElementsByTagName("li")).toHaveLength(9);
    expect(container.getElementsByTagName("a")).toHaveLength(11);
    expect(container.getElementsByTagName("img")).toHaveLength(4);

    expect(logoLink.getAttribute("href")).toBe("/");
    expect(browseLink.getAttribute("href")).toBe("/browse");
    expect(uploadFilesLink.getAttribute("href")).toBe("/uploadFile");
    expect(helpLink.getAttribute("href")).toBe("/topic/132-Help/1-Agreement");
    expect(whitePaperLink.getAttribute("href")).toBe(
      "/files/2012_amplifying_final.pdf"
    );
    expect(blogLink.getAttribute("href")).toBe("https://canonizer.com/blog/");
    expect(jobsLink.getAttribute("href")).toBe(
      "/topic/6-Canonizer-Jobs/1-Agreement"
    );
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



export default loadConfig;