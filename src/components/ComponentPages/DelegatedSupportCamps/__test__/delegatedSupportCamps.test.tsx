import { render, screen, waitFor } from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import DelegatedSupportCampsUI from "../DelegatedSupportCampsUI/index";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;

const viewMoreModalVisible = true;
const isRemoveSupportModalVisible = true;
const showViewMoreModal = jest.fn();
const removeCardDelegatedSupportedCamps = jest.fn();
const handleSupportedCampsCancel = jest.fn();
const handelViewMoreModalCancel = jest.fn();
const removeSupport = jest.fn();
const search = "";
const delegatedSupportCampsList = [
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
      {
        camp_link: "https://www.google.com/",
        support_order: 2,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 3,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 4,
        camp_name: "Supported Camps",
      },
      {
        camp_link: "https://www.google.com/",
        support_order: 5,
        camp_name: "Supported Camps",
      },
    ],
    delegated_to_nick_name: "Rohit_Talentelgia",
    delegated_to_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1138?topicnum=286&campnum=5&namespace=19",
    my_nick_name: "reena_talentelgia",
    my_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1134?topicnum=286&campnum=5&namespace=19",
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
    delegated_to_nick_name: "Rohit_Talentelgia",
    delegated_to_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1138?topicnum=286&campnum=5&namespace=19",
    my_nick_name: "reena_talentelgia",
    my_nick_name_link:
      "https://canonizer-api.teamtalentelgia.com/user/supports/1134?topicnum=286&campnum=5&namespace=19",
  },
];
const viewMoreDataValue = {
  delegated_to_nick_name: "Rohit_Talentelgia",
  delegated_to_nick_name_link:
    "https://canonizer-api.teamtalentelgia.com/user/supports/1138?topicnum=286&campnum=5&namespace=19",
  my_nick_name: "reena_talentelgia",
  my_nick_name_link:
    "https://canonizer-api.teamtalentelgia.com/user/supports/1134?topicnum=286&campnum=5&namespace=19",
  title: "This is a test topic RG",
  title_link:
    "https://canonizer-api.teamtalentelgia.com/topic/286-This-is-a-test-topic-RG/1-Aggreement",
  topic_num: 286,
  camps: [
    {
      camp_link:
        "https://canonizer-api.teamtalentelgia.com/topic/286-This-is-a-test-topic-RG/5-test-camp-12#statement",
      camp_name: "test camp 12",
      camp_num: 5,
      support_added: "2021-10-29",
      support_order: 1,
    },
  ],
};
const removeSupportCampsData = {
  camps: [
    {
      camp_num: 2,
      camp_name: "AI can only be friendly",
      support_order: 1,
      camp_link:
        "/topic/16-Friendly-AI-Importance/2-AI-can-only-be-friendly#statement",
      support_added: "2022-08-10",
    },
  ],
  delegated_nick_name_id: 1,
  delegated_to_nick_name: "Brent_Allsop",
  delegated_to_nick_name_link:
    "/user/supports/1?topicnum=16&campnum=2&namespace=1",
  my_nick_name: "Nick",
  my_nick_name_link: "/user/supports/643?topicnum=16&campnum=2&namespace=1",
  nick_name_id: 643,
  title: "Friendly AI Importance",
  title_link: "/topic/16-Friendly-AI-Importance/1-Agreement",
  topic_num: 16,
};
describe("Delegated Support camps page", () => {
  it("render Modal when Remove support is clicked", () => {
    const { getByText } = render(
      <DelegatedSupportCampsUI
        removeCardDelegatedSupportedCamps={removeCardDelegatedSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isRemoveSupportModalVisible={isRemoveSupportModalVisible}
        showViewMoreModal={(e, data) => showViewMoreModal(e, data)}
        viewMoreDataValue={viewMoreDataValue}
        handelViewMoreModalCancel={handelViewMoreModalCancel}
        viewMoreModalVisible={viewMoreModalVisible}
        delegatedSupportCampsList={delegatedSupportCampsList}
        search={search}
        removeSupport={removeSupport}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(getByText("Remove")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
    expect(screen.getAllByText("Remove Support")).toBeTruthy();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });

  it("render Remove support is clicked", () => {
    render(
      <DelegatedSupportCampsUI
        removeCardDelegatedSupportedCamps={removeCardDelegatedSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isRemoveSupportModalVisible={isRemoveSupportModalVisible}
        showViewMoreModal={(e, data) => showViewMoreModal(e, data)}
        viewMoreDataValue={viewMoreDataValue}
        handelViewMoreModalCancel={handelViewMoreModalCancel}
        viewMoreModalVisible={viewMoreModalVisible}
        delegatedSupportCampsList={delegatedSupportCampsList}
        search={search}
        removeSupport={removeSupport}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render delegated Supported Camps is clicked/active", () => {
    render(
      <DelegatedSupportCampsUI
        removeCardDelegatedSupportedCamps={removeCardDelegatedSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isRemoveSupportModalVisible={isRemoveSupportModalVisible}
        showViewMoreModal={(e, data) => showViewMoreModal(e, data)}
        viewMoreDataValue={viewMoreDataValue}
        handelViewMoreModalCancel={handelViewMoreModalCancel}
        viewMoreModalVisible={viewMoreModalVisible}
        delegatedSupportCampsList={delegatedSupportCampsList}
        search={search}
        removeSupport={removeSupport}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();

    expect(screen.getAllByText(labels.nickname)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.supportdelegatedto)[0]
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.currentSupportedCamps)[0]
    ).toBeInTheDocument();
    // expect(
    //     screen.getAllByText(labels.viewMore)[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render View More is clicked", () => {
    render(
      <DelegatedSupportCampsUI
        removeCardDelegatedSupportedCamps={removeCardDelegatedSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isRemoveSupportModalVisible={isRemoveSupportModalVisible}
        showViewMoreModal={(e, data) => showViewMoreModal(e, data)}
        viewMoreDataValue={viewMoreDataValue}
        handelViewMoreModalCancel={handelViewMoreModalCancel}
        viewMoreModalVisible={viewMoreModalVisible}
        delegatedSupportCampsList={delegatedSupportCampsList}
        search={search}
        removeSupport={removeSupport}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      screen.getAllByText(labels.viewMore)[0] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render Modal View More is clicked", () => {
    render(
      <DelegatedSupportCampsUI
        removeCardDelegatedSupportedCamps={removeCardDelegatedSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isRemoveSupportModalVisible={isRemoveSupportModalVisible}
        showViewMoreModal={(e, data) => showViewMoreModal(e, data)}
        viewMoreDataValue={viewMoreDataValue}
        handelViewMoreModalCancel={handelViewMoreModalCancel}
        viewMoreModalVisible={viewMoreModalVisible}
        delegatedSupportCampsList={delegatedSupportCampsList}
        search={search}
        removeSupport={removeSupport}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      screen.getAllByText(labels.viewMore)[0] as HTMLLabelElement
    ).toBeInTheDocument();
    expect(screen.getAllByText("Current Supported Camps:")).toBeTruthy();
  });
});
