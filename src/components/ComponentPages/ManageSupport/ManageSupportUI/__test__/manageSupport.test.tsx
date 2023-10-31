import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../../utils/testUtils";
import messages from "../../../../../messages";
import ManageSupportUI from "../index";
import { CloseCircleOutlined } from "@ant-design/icons";
import ManageSupport from "../..";
import { Card } from "antd";

const { labels } = messages;
const nickNameList = [
  {
    create_time: "1970-01-01",
    id: "1",
    nick_name: "ABC",
    owner_code: "qwerty",
    private: 0,
  },
  {
    create_time: "1970-02-02",
    id: "2",
    nick_name: "DEF",
    owner_code: "uiop",
    private: 1,
  },
];
//   camp_num: expect.any(Number),
//   disable_submit: "true",
//   is_confirm: expect.any(Number),
//   is_delegator: expect.any(Number),
//   message: expect.any(String),
//   remove_camps: [
//     {
//       camp_name: expect.any(String),
//       camp_num: expect.any(Number),
//       link: expect.any(String),
//       support_order: expect.any(Number),
//     },
//   ],
//   support_flag: expect.any(Number),
//   topic_num: expect.any(Number),
//   warning: expect.any(String),
// };

// const currentDelegatedSupportedClick = {
//   delegatedSupportClick: true,
// };
// const checkDelegateClick = true;
// const manageSupportLink = "/support/949-top/2-camp-1 link";
const manageSupportList = [
  {
    camp_name: "Test Camp name",
    camp_num: 2,
    id: 1,
    link: "/topic/949-top/2-camp-1",
    support_order: 1,
    topic_num: 10,
  },
];
const clearAllChanges = jest.fn();
const removeAll = jest.fn();
const handleClose = jest.fn();
const checked = true;
const setManageSupportList = [],
  parentSupportDataList = [],
  getSupportStatusData = null,
  submitNickNameSupportCamps = jest.fn(),
  cancelManageRoute = jest.fn(),
  setSelectedtNickname = jest.fn(),
  selectedtNickname = "",
  setUpdatePostion = jest.fn();
const submitButtonDisable = false;
const unableToFindCamp = false;
const campRecord = {
  camp_about_nick_id: 0,
  camp_about_nick_name: "joy",
  camp_about_url: "",
  camp_name: "Test Camp name",
  camp_num: 0,
  direct_archive: 0,
  flag: 0,
  go_live_time: 1685597186,
  // is_archive: 0,
  is_disabled: 0,
  is_one_level: 0,
  key_words: "",
  nick_name: "",
  note: 0,
  parentCamps: [
    {
      camp_name: "Test Camp name",
      camp_num: 1,
      topic_num: 23,
    },
  ],
};

const manageSupport = ["abc-name", "def-age"];
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { manageSupport: manageSupport },
    push: jest.fn(),
  })),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn().mockImplementation(() => {
    return {
      campRecord: {
        camp_name: "Test Camp name",
      },
      asof: "",
      asofdate: "",
      manageSupportUrlLink: "",
      currentDelegatedSupportedClick: {
        
      },
      currentGetCheckSupportExistsData: {
        
      },
      CurrentCheckSupportStatus: "",
      manageSupportStatusCheck: true,
    };
  }),
}));
jest.mock("src/hooks/isUserAuthenticated", () =>
  jest.fn(() => ({ isUserAuthenticated: true }))
);
jest.mock("src/network/api/campDetailApi", () => ({
  getAllUsedNickNames: jest.fn(),
  getCurrentCampRecordApi: jest.fn()
  .mockReturnValue(Promise.resolve({ camp_name: "Test Camp name" })),
  getAllRemovedReasons: jest
    .fn()
    .mockReturnValue(Promise.resolve({ success: true })),
  getCampBreadCrumbApi: jest.fn(() =>
    Promise.resolve({ data: {}, status_code: 200 })
  ),
}));
jest.mock("src/network/api/topicAPI", () => ({
  GetActiveSupportTopic: jest.fn(() =>
    Promise.resolve({ data: [], status_code: 200 })
  ),
  GetCheckSupportExists: jest.fn(() =>
    Promise.resolve({
      data: {
        remove_camps: [],
      },
      status_code: 200,
    })
  ),
}));
jest.mock("src/network/api/userApi", () => ({
  addSupport: jest.fn(() => Promise.resolve({ status_code: 200, data: [{}] })),
  removeSupportedCamps: jest.fn(() =>
    Promise.resolve({
      data: {
        remove_camps: {},
      },
      status_code: 200,
    })
  ),
}));
const supportRemovedModal = () => <div>Removed Modal</div>;
supportRemovedModal.displayName = 'SupportRemovedModal';
jest.mock("src/components/common/supportRemovedModal", () =>{
  return()=> supportRemovedModal 
},{virtual:true});


describe("ManageSupportUI", () => {
  it("render show SupportedCamps", () => {
    render(
      <ManageSupportUI
        nickNameList={nickNameList}
        manageSupportList={manageSupportList}
        clearAllChanges={clearAllChanges}
        removeAll={removeAll}
        handleClose={handleClose}
        checked={checked}
        setManageSupportList={setManageSupportList}
        parentSupportDataList={parentSupportDataList}
        getSupportStatusData={getSupportStatusData}
        submitNickNameSupportCamps={submitNickNameSupportCamps}
        cancelManageRoute={cancelManageRoute}
        setSelectedtNickname={setSelectedtNickname}
        selectedtNickname={selectedtNickname}
        submitButtonDisable={submitButtonDisable}
        setUpdatePostion={setUpdatePostion}
        unableToFindCamp={unableToFindCamp}
      />
    );
    expect(screen.getByText(labels.SupportedCamps)).toBeTruthy();
  });
});

describe("ManageSupportUI Nick name", () => {
  it("render show Nickname To Support Above Camps", () => {
    render(
      <ManageSupportUI
        nickNameList={nickNameList}
        manageSupportList={manageSupportList}
        clearAllChanges={clearAllChanges}
        removeAll={removeAll}
        handleClose={handleClose}
        checked={checked}
        setManageSupportList={setManageSupportList}
        parentSupportDataList={parentSupportDataList}
        getSupportStatusData={getSupportStatusData}
        submitNickNameSupportCamps={submitNickNameSupportCamps}
        cancelManageRoute={cancelManageRoute}
        setSelectedtNickname={setSelectedtNickname}
        selectedtNickname={selectedtNickname}
        submitButtonDisable={submitButtonDisable}
        setUpdatePostion={setUpdatePostion}
        unableToFindCamp={unableToFindCamp}
      />
    );
    expect(screen.getByText("Nickname To Support Above Camps")).toBeTruthy();
  });
});

it("render show submit button", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  const submitButton = getAllByText("Submit")[0] as HTMLButtonElement;
  expect(submitButton).toBeTruthy();
});

it("render show cancel button", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  const cancelButton = getAllByText("Cancel")[0] as HTMLButtonElement;
  expect(cancelButton).toBeTruthy();
});
/* eslint-disable */

it("render support remove card component", () => {
  const manageSupportList = [
    {
      camp_name: "Test Camp name",
      camp_num: 2,
      id: 1,
      link: "/topic/949-top/2-camp-1",
      support_order: 1,
      topic_num: 10,
    },
  ];
  const mockRemoveAll = jest.fn();
  render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={mockRemoveAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  // eslint-disable-next-line
  const checkboxElement = screen.getByTestId("checkbox");
  fireEvent.click(checkboxElement);
});
/* eslint-enable */

it("render show clear changes button", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  const clearChangesButton = getAllByText(
    "Clear all changes"
  )[0] as HTMLButtonElement;
  expect(clearChangesButton).toBeTruthy();
  expect(<CloseCircleOutlined />).toBeTruthy();
});

it("render show Quick Action Text", () => {
  render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  expect(screen.getByText("Quick Actions:")).toBeTruthy();
  expect(messages).toBeDefined();
});

it("render show Remove all Text", () => {
  const { getAllByText } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  const removeAllText = getAllByText("Remove all");
  expect(removeAllText).toBeTruthy();
});

it("render show checkbox", () => {
  const { container } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  expect(
    container.getElementsByClassName("ManageSupport_checkbox__DQcrk")
  ).toBeTruthy();
});

it("render show the text line when the topic list array is not empty", () => {
  render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  expect(screen.queryByTestId(labels.topicSupportText)).toBeNull();
});

it("render show manage support note", () => {
  render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  expect(screen.getByText(labels.manageSupportNote)).toBeTruthy();
});

it("render show dropdown", () => {
  const { container } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  expect(
    container.getElementsByClassName("ant-select-selection-item")
  ).toBeTruthy();
});

it("Check the checkbox is checked/unchecked", () => {
  const { container } = render(
    <ManageSupportUI
      nickNameList={nickNameList}
      manageSupportList={manageSupportList}
      clearAllChanges={clearAllChanges}
      removeAll={removeAll}
      handleClose={handleClose}
      checked={checked}
      setManageSupportList={setManageSupportList}
      parentSupportDataList={parentSupportDataList}
      getSupportStatusData={getSupportStatusData}
      submitNickNameSupportCamps={submitNickNameSupportCamps}
      cancelManageRoute={cancelManageRoute}
      setSelectedtNickname={setSelectedtNickname}
      selectedtNickname={selectedtNickname}
      submitButtonDisable={submitButtonDisable}
      setUpdatePostion={setUpdatePostion}
      unableToFindCamp={unableToFindCamp}
    />
  );
  expect(
    container.getElementsByClassName("ant-select-selection-item")
  ).toBeTruthy();
  expect(
    container.getElementsByClassName("ManageSupport_checkbox__DQcrk")
  ).toBeTruthy();
});

// it("should render card with title and content", () => {
//   render(
//     <ManageSupportUI
//       nickNameList={nickNameList}
//       manageSupportList={manageSupportList}
//       clearAllChanges={clearAllChanges}
//       removeAll={removeAll}
//       handleClose={handleClose}
//       checked={checked}
//       setManageSupportList={setManageSupportList}
//       parentSupportDataList={parentSupportDataList}
//       getSupportStatusData={getSupportStatusData}
//       submitNickNameSupportCamps={submitNickNameSupportCamps}
//       cancelManageRoute={cancelManageRoute}
//       setSelectedtNickname={setSelectedtNickname}
//       selectedtNickname={selectedtNickname}
//       submitButtonDisable={submitButtonDisable}
//       setUpdatePostion={setUpdatePostion}
//       unableToFindCamp={unableToFindCamp}
//     />
//   );

//   const tagBtn = screen.getByTestId("tag-btn")
//   expect(tagBtn).toBeInTheDocument()
 
// });
// it("should render card with title and contents", async () => {
//   const nicknamelist = [];
//   const manageSupportList = [];
//   const removeAll = jest.fn();
//   const handleClose = jest.fn();
//   const checked = false;
//   const setManageSupportList = jest.fn();
//   const parentSupportDataList = jest.fn();
//   const getSupportStatusData = "";
//   const submitNickNameSupportCamps = jest.fn();
//   const cancelManageRoute = jest.fn();
//   const setSelectedtNickname = jest.fn();
//   const selectedtNickname = "";
//   const submitButtonDisable = false;
//   const setUpdatePostion = jest.fn();
//   const unableToFindCamp = false;

//   const { getByTestId } = render(
//     <ManageSupportUI
//       nickNameList={nicknamelist}
//       manageSupportList={manageSupportList}
//       clearAllChanges={clearAllChanges}
//       removeAll={removeAll}
//       handleClose={handleClose}
//       checked={checked}
//       setManageSupportList={setManageSupportList}
//       parentSupportDataList={parentSupportDataList}
//       getSupportStatusData={getSupportStatusData}
//       submitNickNameSupportCamps={submitNickNameSupportCamps}
//       cancelManageRoute={cancelManageRoute}
//       setSelectedtNickname={setSelectedtNickname}
//       selectedtNickname={selectedtNickname}
//       submitButtonDisable={submitButtonDisable}
//       setUpdatePostion={setUpdatePostion}
//       unableToFindCamp={unableToFindCamp}
//     />
//   );
//   const inputEl = getByTestId("select-option");
//   expect(inputEl).toBeInTheDocument();
//   // expect(inputEl).toHaveAttribute("type", "text");
//   fireEvent.click(inputEl);

//   // await fireEvent.change(inputEl, { target: { value: "abc" } });
//   // userEvent.selectOptions(getByTestId('select-option'), '<value>');
// });
describe("Manage support", () => {
  it("render nick name list", async () => {
    await render(<ManageSupport />);
    waitFor(() => {
      expect(screen.getByText(nickNameList[0].create_time)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].id)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].nick_name)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].owner_code)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].private)).toBeInTheDocument();
    });
  });
  it("render camp record", async() => {
    await render(<ManageSupport />);
    waitFor(async () => {
      const tagBtn = screen.getByText("Test Camp name")
      expect(tagBtn).toBeInTheDocument()
      fireEvent.click(tagBtn)
      expect(
        screen.getByText(campRecord.camp_about_nick_id)
      ).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.camp_about_nick_name)
      ).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_about_url)).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_name)).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_num)).toBeInTheDocument();
      expect(screen.getByText(campRecord.direct_archive)).toBeInTheDocument();
      expect(screen.getByText(campRecord.flag)).toBeInTheDocument();
      expect(screen.getByText(campRecord.go_live_time)).toBeInTheDocument();
      // expect(screen.getByText(campRecord.is_archive)).toBeInTheDocument();
      expect(screen.getByText(campRecord.is_disabled)).toBeInTheDocument();
      expect(screen.getByText(campRecord.is_one_level)).toBeInTheDocument();
      expect(screen.getByText(campRecord.key_words)).toBeInTheDocument();
      expect(screen.getByText(campRecord.note)).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.parentCamps[0].camp_name)
      ).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.parentCamps[0].camp_num)
      ).toBeInTheDocument();
      expect(
        screen.getByText(campRecord.parentCamps[0].topic_num)
      ).toBeInTheDocument();
    });
  });
});

// describe("Test Case", () => {
//   // beforeEach(()=>{
//     jest.mock("react-redux", () => ({
//       ...jest.requireActual("react-redux"),
//       useSelector: jest.fn().mockImplementation(() => {
//         return {
//           campRecord: {
//             camp_name: "ABC",
//           },
//           asof: "",
//           asofdate: "",
//           manageSupportUrlLink: "",
//           currentDelegatedSupportedClick: {},
//           currentGetCheckSupportExistsData: {
//             is_delegator: true
//           },
//           CurrentCheckSupportStatus: "",
//           manageSupportStatusCheck: true,
//         };
//       }),
//     }));
//   // })
describe("Manage support ui cancle or submit button", () => {
  it("click on cancel button", () => {
    const { getAllByText, container } = render(<ManageSupport></ManageSupport>);
    const cancel_button = getAllByText("Cancel")[0];
    fireEvent.click(cancel_button);
    expect(
      container.getElementsByClassName("ant-select-selection-item")
    ).toBeTruthy();
  });
  it("click on Submit button", () => {
    const { getAllByText, container } = render(<ManageSupport></ManageSupport>);
    const cancel_button = getAllByText("Submit")[0];
    fireEvent.click(cancel_button);
    expect(
      container.getElementsByClassName("ant-select-selection-item")
    ).toBeTruthy();
  });

  it("click on clear all changes button", () => {
    const { getAllByText, container } = render(<ManageSupport></ManageSupport>);
    const clear_all_button = getAllByText("Clear all changes")[0];
    fireEvent.click(clear_all_button);
    expect(
      container.getElementsByClassName("ant-select-selection-item")
    ).toBeTruthy();
  });

  it("click on remove all changes button", () => {
    const { getAllByTestId, container } = render(
      <ManageSupport></ManageSupport>
    );
    const remove_all_button = getAllByTestId("checkbox")[0];
    fireEvent.click(remove_all_button);
    expect(
      container.getElementsByClassName("ManageSupport_checkbox__DQcrk")
    ).toBeTruthy();
  });
});
// describe("Test Cases", () => {
//   // beforeEach(()=>{
//     jest.mock("react-redux", () => ({
//       ...jest.requireActual("react-redux"),
//       useSelector: jest.fn().mockImplementation(() => {
//         return {
//           campRecord: {
//             camp_name: "ABC",
//           },
//           asof: "",
//           asofdate: "",
//           manageSupportUrlLink: "",
//           currentDelegatedSupportedClick: {},
//           currentGetCheckSupportExistsData: {
//             is_delegator: false
//           },
//           CurrentCheckSupportStatus: "",
//           manageSupportStatusCheck: true,
//         };
//       }),
//     }));
//   })
//   it("click on Submit button - Add or Remove Api", () => {
//     const { getAllByText } = render(<ManageSupport></ManageSupport>);
//     const submit_button = getAllByText("Submit")[0];
//     fireEvent.click(submit_button);
//   });
// })
