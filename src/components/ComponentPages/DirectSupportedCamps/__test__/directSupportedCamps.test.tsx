// import { render, screen, waitFor } from "../../../../utils/testUtils";
// import userEvent from "@testing-library/user-event";
// import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
// import messages from "../../../../messages";

// const { labels, placeholders, validations } = messages;

// const isSupportedCampsModalVisible = true;
// const removeCardSupportedCamps = jest.fn();
// const handleSupportedCampsCancel = jest.fn();
// const removeSupport = jest.fn();
// const search = "";

// const directSupportedCampsList = [
//   {
//     id: "1",
//     title_link: "https://www.google.com/",
//     title: "Direct Supported camps",
//     camps: [
//       {
//         camp_link: "https://www.google.com/",
//         support_order: 1,
//         camp_name: "Supported Camps",
//       },
//     ],
//   },
//   {
//     id: "2",
//     title_link: "https://www.google.com/",
//     title: "Direct Supported camps 2",
//     camps: [
//       {
//         camp_link: "https://www.google.com/",
//         support_order: 2,
//         camp_name: "Supported Camps 2",
//       },
//     ],
//   },
// ];
// describe("Direct Support camps page", () => {
//   it("render Modal when Remove support is clicked", () => {
//     render(
//       <DirectSupportedCampsUI
//         removeCardSupportedCamps={removeCardSupportedCamps}
//         handleSupportedCampsCancel={handleSupportedCampsCancel}
//         isSupportedCampsModalVisible={isSupportedCampsModalVisible}
//         directSupportedCampsList={directSupportedCampsList}
//         search={search}
//         removeSupport={removeSupport}
//       />
//     );
//     expect(screen.getByText("Remove")).toBeTruthy();
//     expect(screen.getByText("Cancel")).toBeTruthy();
//     expect(screen.getByText("Remove Support")).toBeInTheDocument();
//     expect(
//       screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//   });
//   it("render Remove support is clicked", () => {
//     const { getByText } = render(
//       <DirectSupportedCampsUI
//         removeCardSupportedCamps={removeCardSupportedCamps}
//         handleSupportedCampsCancel={handleSupportedCampsCancel}
//         isSupportedCampsModalVisible={isSupportedCampsModalVisible}
//         directSupportedCampsList={directSupportedCampsList}
//         search={search}
//         removeSupport={removeSupport}
//       />
//     );
//     expect(
//       screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//   });
//   it("render direct Supported Camps is clicked/active", () => {
//     render(
//       <DirectSupportedCampsUI
//         removeCardSupportedCamps={removeCardSupportedCamps}
//         handleSupportedCampsCancel={handleSupportedCampsCancel}
//         isSupportedCampsModalVisible={isSupportedCampsModalVisible}
//         directSupportedCampsList={directSupportedCampsList}
//         search={search}
//         removeSupport={removeSupport}
//       />
//     );
//     expect(
//       screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//     expect(
//       screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
//     ).toBeInTheDocument();
//   });
// });
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";
import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
import messages from "../../../../messages";
import { Input } from "antd";

const { labels, placeholders, validations } = messages;

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
const showSaveChanges = jest.fn();
const saveChanges = jest.fn();
const handleClose = jest.fn();
const setSearch = jest.fn();
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
    id: "2",
    title_link: "https://www.google.com/",
    title: "User profile",
    camps: [
      {
        camp_link: "https://www.google.com/",
        support_order: 2,
        camp_name: "Sample User profile",
      },
    ],
  },
];
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
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    );
    expect(screen.getByText("Remove")).toBeTruthy();
    expect(screen.getByText("Remove Support")).toBeInTheDocument();
    expect(
      screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
    ).toBeInTheDocument();
  });
  it("render Remove support is clicked", () => {
    const { getByText } = render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
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
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
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
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
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
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    );
    <input placeholder="Search by topic name" />;
    screen.queryByPlaceholderText(/Search by topic name/i);
  });
  it("update a value when write in search box", () => {
    render(
      <DirectSupportedCampsUI
        removeCardSupportedCamps={removeCardSupportedCamps}
        handleSupportedCampsCancel={handleSupportedCampsCancel}
        isSupportedCampsModalVisible={isSupportedCampsModalVisible}
        directSupportedCampsList={directSupportedCampsList}
        setDirectSupportedCampsList={setDirectSupportedCampsList}
        search={search}
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    );
    const searchInput = screen.getByText("Search by topic name");
    console.log(searchInput);
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
        removeSupport={removeSupport}
        handleClose={handleClose}
        saveChanges={saveChanges}
        showSaveChanges={showSaveChanges}
        setRevertBack={setRevertBack}
        revertBack={revertBack}
        handleRevertBack={handleRevertBack}
        visible={visible}
        idData={idData}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    );
    expect(
      container.getElementsByClassName("ant-btn ant-btn-default")
    ).toBeTruthy();
  });
});
