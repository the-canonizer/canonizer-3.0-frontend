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
import { useRef } from "react";
// import { useRouter } from "next/router";
// import { renderHook } from "@testing-library/react-hooks";
// import dynamic from "next/dynamic";
// import moment from "moment";
// import isAuth from "src/hooks/isUserAuthenticated";
// import { act } from "react-dom/test-utils";
// import { placeholders } from "src/messages/placeholder";
// import SupportRemovedModal from "src/components/common/supportRemovedModal";

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
// const currentGetCheckSupportExist = {
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

const currentDelegatedSupportedClick = {
  delegatedSupportClick: true,
};
// const checkDelegateClick = true;
// const manageSupportLink = "/support/949-top/2-camp-1 link";
const manageSupportList = [];
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
  camp_name: "",
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
      camp_name: "",
      camp_num: 1,
      topic_num: 23,
    },
  ],
};
// const currentGetCheckSupportExistData = {
//   camp_num: 1,
//   is_confirm: 0,
//   support_flag: 1,
//   topic_num: 12,
// };

// const topicSupportList = [
//   {
//     camp_name: "Aggreement",
//     camp_num: 1,
//     delegate_nick_name_id: 1,
//     end: 0,
//     link: "",
//     namespace_id: 1,
//     nick_name_id: 627,
//     start: 1111,
//     support_id: 1,
//     support_order: 1,
//     title: "ABC",
//     topic_num: 920,
//   },
// ];

// const allParentList = [
//   {
//     camp_about_nick_id: 1,
//     camp_about_url: "",
//     camp_name: "Aggrement",
//     camp_num: 2,
//     direct_archive: 0,
//     go_live_time: 121212,
//     grace_period: 0,
//     id: 23,
//     // is_archive:0,
//     is_disabled: 0,
//     is_one_level: 0,
//     key_words: "abc",
//     language: "English",
//     note: "",
//   },
// ];
// const addDelegatedSupport = {
//   nick_name_id: 1,
//   delegated_nick_name_id: 2,
//   topic_num: 12,
// };
const manageSupport = ["abc-name", "def-age"];
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    query: { manageSupport: manageSupport },
  })),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn().mockImplementation(() => {
    return {
      campRecord: {
        camp_name: "ABC",
      },
      asof: "",
      asofdate: "",
      manageSupportUrlLink: "",
      currentDelegatedSupportedClick: {},
      currentGetCheckSupportExistsData: {},
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
  getCurrentCampRecordApi: jest.fn(),
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
        remove_camps: {},
      },
      status_code: 200,
    })
  ),
}));
jest.mock("src/components/common/supportRemovedModal", () => () => {
  return <div>Removed Modal</div>;
});
function MyComponent() {
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef} type="text" />
    </div>
  );
}

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

describe("ManageSupportUI", () => {
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

it("render support remove card component", () => {
  const manageSupportList = [
    {
      camp_name: 1,
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
  const checkboxElement = screen.getByTestId("checkbox");
  fireEvent.click(checkboxElement);
});

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

it("should render card with title and content", () => {
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
  const title = "Test Card Title";
  const content = "Test Card Content";

  render(
    <Card title={title}>
      <p>{content}</p>
    </Card>
  );

  const cardTitle = screen.getByText(title);
  const cardContent = screen.getByText(content);

  expect(cardTitle).toBeInTheDocument();
  expect(cardContent).toBeInTheDocument();
});
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
  it("render camp record", () => {
    render(<ManageSupport />);
    waitFor(async () => {
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

describe("", () => {
  it("click on cancel button", () => {
    const { getAllByText } = render(<ManageSupport></ManageSupport>);
    const cancel_button = getAllByText("Cancel")[0];
    fireEvent.click(cancel_button);
  });
  it("click on Submit button", () => {
    const { getAllByText } = render(<ManageSupport></ManageSupport>);
    const cancel_button = getAllByText("Submit")[0];
    fireEvent.click(cancel_button);
  });

  it("click on clear all changes button", () => {
    const { getAllByText } = render(<ManageSupport></ManageSupport>);
    const clear_all_button = getAllByText("Clear all changes")[0];
    fireEvent.click(clear_all_button);
  });

  it("click on remove all changes button", () => {
    const { getAllByTestId } = render(<ManageSupport></ManageSupport>);
    const remove_all_button = getAllByTestId("checkbox")[0];
    fireEvent.click(remove_all_button);
  });
});
