import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;

const isSupportedCampsModalVisible = true;
const RemoveCardSupportedCamps = jest.fn();
const handleSupportedCampsCancel = jest.fn();
const RemoveSupport = jest.fn();
const search = "";

const directSupportedCampsList = [
  {
    id: "1",
    title_link: "https://www.google.com/",
    title: "Direct Supported camps",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 1,
        camp_name: "Supported Camps",
      },
    ],
  },
  {
    id: "2",
    title_link: "https://www.google.com/",
    title: "Direct Supported camps 2",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 2,
        camp_name: "Supported Camps 2",
      },
    ],
  },
];
describe("Direct Support camps page", () => {
  it("render Modal when Remove support is clicked", () => {
    render(
      <DirectSupportedCampsUI
        RemoveCardSupportedCamps={RemoveCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        search={search}
        RemoveSupport={RemoveSupport}
      />
    );
    expect(screen.getByText("Remove")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Remove Support")).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render Remove support is clicked", () => {
    const { getByText } = render(
      <DirectSupportedCampsUI
        RemoveCardSupportedCamps={RemoveCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        search={search}
        RemoveSupport={RemoveSupport}
      />
    );
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render direct Supported Camps is clicked/active", () => {
    render(
      <DirectSupportedCampsUI
        RemoveCardSupportedCamps={RemoveCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        search={search}
        RemoveSupport={RemoveSupport}
      />
    );
    expect(
      screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
});
