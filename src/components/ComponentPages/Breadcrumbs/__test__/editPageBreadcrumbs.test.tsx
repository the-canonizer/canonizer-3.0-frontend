import { render, screen, waitFor } from "@testing-library/react";

import EditPageBreadcrumbs from "../editPageBreadcrumbs";
import { getCampBreadCrumbApi } from "src/network/api/campDetailApi";

jest.mock("src/network/api/campDetailApi", () => ({
  getCampBreadCrumbApi: jest.fn(),
}));

jest.mock("src/components/common/customSkelton", () => () => (
  <div>loading</div>
));

describe("EditPageBreadcrumbs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCampBreadCrumbApi as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: {
        topic_name: "Theories of Mind",
        bread_crumb: [
          { camp_num: 1, camp_name: "Agreement" },
          { camp_num: 2, camp_name: "Approachable Via Science" },
          { camp_num: 7, camp_name: "Mind Brain Identity" },
        ],
      },
    });
  });

  it("renders the full path with every crumb linking to its camp page", async () => {
    render(
      <EditPageBreadcrumbs
        topicNum={88}
        campNum={7}
        currentLabel="Updating camp statement"
      />
    );

    await waitFor(() =>
      expect(screen.getByText("Theories of Mind")).toBeInTheDocument()
    );

    expect(getCampBreadCrumbApi).toHaveBeenCalledWith(
      expect.objectContaining({ topic_num: 88, camp_num: 7 })
    );
    expect(screen.getByText("Theories of Mind").closest("a")).toHaveAttribute(
      "href",
      "/topic/88-Theories-of-Mind/1-Agreement"
    );
    expect(
      screen.getByText("Approachable Via Science").closest("a")
    ).toHaveAttribute(
      "href",
      "/topic/88-Theories-of-Mind/2-Approachable-Via-Science"
    );
    expect(
      screen.getByText("Mind Brain Identity").closest("a")
    ).toHaveAttribute(
      "href",
      "/topic/88-Theories-of-Mind/7-Mind-Brain-Identity"
    );
    expect(screen.queryByText("Agreement")).not.toBeInTheDocument();
    expect(screen.getByText("Updating camp statement")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(document.querySelector('a[href*="/manage/"]')).toBeNull();
  });

  it("renders nothing without a topic", () => {
    const { container } = render(<EditPageBreadcrumbs topicNum={undefined} />);
    expect(container).toBeEmptyDOMElement();
    expect(getCampBreadCrumbApi).not.toHaveBeenCalled();
  });
});
