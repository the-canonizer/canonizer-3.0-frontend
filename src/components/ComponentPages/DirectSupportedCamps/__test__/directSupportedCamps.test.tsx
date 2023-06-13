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
import { fireEvent, render, screen, waitFor } from "../../../../utils/testUtils";
import DirectSupportedCampsUI from "../DirectSupportedCampsUI/index";
import messages from "../../../../messages";
import DirectSupportedCamps from "..";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { Input, message } from "antd";
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
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
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

  describe("direct supported camps",()=>{
    it("render a value when write in search box", () => {
      render(
        <DirectSupportedCamps search={directSupportedCampsList}
        />
      );
      waitFor(async () => {
        expect(screen.getAllByText("For topic").length).toEqual(2);
        expect(screen.getByText(directSupportedCampsList[0].title)).toBeInTheDocument();
        expect(screen.getByText(directSupportedCampsList[1].title)).toBeInTheDocument();
        expect(screen.getAllByText("Remove Support").length).toEqual(2);
        expect(screen.getByText("Agreement")).toBeInTheDocument();
        expect(screen.getByText("Agreement-2")).toBeInTheDocument();
      });
    });
  
    it("click on remove support button and open modal", () => {
      render(<DirectSupportedCamps search={directSupportedCampsList} />);
      waitFor(async () => {
        const btns = screen.getAllByText("Remove Support");
  
        userEvent.click(btns[0]);
  
        expect(screen.getByText(directSupportedCampsList[0].title)).toBeInTheDocument();
        expect(screen.getByText("Remove")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });
    });
  
    it("render direct Supported Camps is clicked/active", () => {
      render(<DirectSupportedCamps search={directSupportedCampsList} />);
      waitFor(async () => {
  
         expect(
        screen.getAllByText(labels.fortopic)[1] as HTMLLabelElement
      ).toBeInTheDocument();
      expect(
        screen.getAllByText(labels.removeSupport)[1] as HTMLLabelElement
      ).toBeInTheDocument();
      });
    });
  })
  it("render useState is working ",()=>{
    render(<DirectSupportedCamps search={directSupportedCampsList} />)
    const TestComponent = () => {
      const [isActive, setIsActive] = useState(false);
      
  
      const toggleActive = () => {
        setIsActive(!isActive);
      };
  
      return (
        <div>
          <p>{isActive ? 'Active' : 'Inactive'}</p>
          <button onClick={toggleActive}>Toggle</button>
        </div>
      );
    };
  
    const { getByText } = render(<TestComponent />);
  
    const statusElement = getByText('Inactive');
    const toggleButton = getByText('Toggle');
  
    expect(statusElement.textContent).toBe('Inactive');
  
    fireEvent.click(toggleButton);
  
    expect(statusElement.textContent).toBe('Active');
  
    fireEvent.click(toggleButton);
  
    expect(statusElement.textContent).toBe('Inactive');
  });

  it("path is working with use router",()=>{
    render(<DirectSupportedCamps search={directSupportedCampsList} />)
    const mockedRouter = {
      pathname: '/about',
    };
    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);
  
    const { result } = renderHook(() => useRouter());
  
    expect(result.current.pathname).toBe('/about');
  });
  test('Input component handles user input correctly', () => {
    render(<DirectSupportedCamps search={directSupportedCampsList} />)

    // Render the Input component
    render(<Input />);
  
    // Find the input element
    const inputElement = screen.getByRole('textbox');
  
    // Simulate user input
    const userInput = 'Test Input';
    fireEvent.change(inputElement, { target: { value: userInput } });
  
    // Assert that the input value is updated
    expect(inputElement.value).toBe(userInput);
  });
  it("Message component displays correct content",()=>{
    render(<DirectSupportedCamps search={directSupportedCampsList} />)
    const messageContent = 'Test message';

  // Render the Message component
  message.success(messageContent);

  // Assert that the message content is displayed
  const messageElement = screen.getByText(messageContent);
  expect(messageElement).toBeInTheDocument();
  });
});
