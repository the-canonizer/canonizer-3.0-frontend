import { fireEvent, render, screen, waitFor } from "../../../../utils/testUtils";
import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
import messages from "../../../../messages";
import DirectSupportedCamps from "..";
import { wait } from "@testing-library/user-event/dist/utils";

const { labels } = messages;

const isSupportedCampsModalVisible = true;
const removeCardSupportedCamps = jest.fn();
const handleSupportedCampsCancel = jest.fn();
const removeSupport = jest.fn();
const search = "",
  idData = "",
  visible = "false",
  revertBack = [];
const handleOk = jest.fn();
const handleCancel = jest.fn();
const handleRevertBack = jest.fn();
const setRevertBack = jest.fn();
const showSaveChanges = false;
const setCardCamp_ID = jest.fn();
const setShowSaveChanges = jest.fn();
const saveChanges = jest.fn();
const handleClose = jest.fn();
const setDirectSupportedCampsList = [];

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
  {
    id: "3",
    title_link: "https://www.google.com/",
    title: "User profile",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 3,
        camp_name: "Sample User profile",
      },
    ],
  },
];
const removeSupportCampsData = {
  camps: [
    {
      id: 1,
      camp_num: 1,
      camp_name: "Agreement",
      support_order: 1,
      camp_link: "/topic/788-absd---/1-Agreement#statement",
    },
  ],
  nick_name_id: 571,
  title: "absd@#$",
  title_link: "/topic/788-absd---/1-Agreement",
  topic_num: 788,
};
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("src/network/api/userApi", () => ({
  getDirectSupportedCampsList: jest.fn(() =>
    Promise.resolve({ data: [], status_code: 200 })
  ),
  removeOrUpdateDirectSupportCamps: jest.fn(() =>
    Promise.resolve({
      data: [
        {
          removeEntireData: {},
        },
      ],
      status_code: 200,
    })
  ),
}));

jest.mock("src/network/api/topicAPI", () => ({
  GetActiveSupportTopic: jest.fn(() =>
    Promise.resolve({ data: [], status_code: 200 })
  ),
  GetCheckSupportExists: jest.fn(() =>
    Promise.resolve({
      data: {
        remove_camps: {},
      },
      status_code: 200,
    })
  ),
}));

describe("Direct Support camps page", () => {
  it("render Modal when Remove support is clicked", () => {
    render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        setCardCamp_ID={setCardCamp_ID}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setShowSaveChanges={setShowSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(screen.getByText(labels.remove)).toBeTruthy();
    expect(screen.getAllByText(labels.removeSupport)).toBeTruthy();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render Remove support is clicked", () => {
    render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        setCardCamp_ID={setCardCamp_ID}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setShowSaveChanges={setShowSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render direct Supported Camps is clicked/active", () => {
    render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        setCardCamp_ID={setCardCamp_ID}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setShowSaveChanges={setShowSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render Modal when Topic is clicked", () => {
    render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        setCardCamp_ID={setCardCamp_ID}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setShowSaveChanges={setShowSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(screen.getByText("OK")).toBeTruthy();
    expect(screen.getByText("Changes will be reverted ?")).toBeTruthy();
  });
  it("render a value when write in search box", () => {
    render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        setCardCamp_ID={setCardCamp_ID}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setShowSaveChanges={setShowSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    <input placeholder="Search by topic name" />;
    screen.queryByPlaceholderText(/Search by topic name/i);
    expect(screen.getByText("OK")).toBeTruthy();
  });

  it("render click on topic cross button then two buttons are activated", () => {
    const { container } = render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        setCardCamp_ID={setCardCamp_ID}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setShowSaveChanges={setShowSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
        removeSupportCampsData={removeSupportCampsData}
      />
    );
    expect(
      container.getElementsByClassName("ant-btn ant-btn-default")
    ).toBeTruthy();
  });
});
