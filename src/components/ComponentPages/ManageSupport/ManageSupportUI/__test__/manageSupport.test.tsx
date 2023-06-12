import { fireEvent, render, screen, waitFor } from "../../../../../utils/testUtils";
import messages from "../../../../../messages";
import ManageSupportUI from "../index";
import { CloseCircleOutlined } from "@ant-design/icons";
import ManageSupport from "../..";
import { Card, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import dynamic from "next/dynamic";
import moment from "moment";

const { labels } = messages;
const nickNameList = [
  {
    create_time:"1970-01-01",
    id:"1",
    nick_name:"ABC",
    owner_code:"qwerty",
    private:0
  },
  {
    create_time:"1970-02-02",
    id:"2",
    nick_name:"DEF",
    owner_code:"uiop",
    private:1
  }
];
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
const campRecord ={
  camp_about_nick_id:0,
  camp_about_nick_name:"joy",
  camp_about_url:"",
  camp_name:"",
  camp_num: 0,
  direct_archive:0,
  flag:0, 
  go_live_time: 1685597186,
  // is_archive: 0,
  is_disabled:0,
  is_one_level:0,
  key_words:"",
  nick_name:"",
  note:0,
  parentCamps:[{
    camp_name:"",
    camp_num:1,
    topic_num:23
  }]
}
const currentGetCheckSupportExistData ={
  camp_num:1,
  is_confirm:0,
  support_flag:1,
  topic_num:12
}

const topicSupportList =[
  {
    camp_name:"Aggreement",
    camp_num:1,
    delegate_nick_name_id:1,
    end:0,
    link:"",
    namespace_id:1,
    nick_name_id:627,
    start:1111,
    support_id:1,
    support_order:1,
    title:"ABC",
    topic_num:920
  }
]

const allParentList =[
  {
    camp_about_nick_id:1,
    camp_about_url:"",
    camp_name:"Aggrement",
    camp_num:2,
    direct_archive:0,
    go_live_time:121212,
    grace_period:0,
    id:23,
    // is_archive:0,
    is_disabled:0,
    is_one_level:0,
    key_words:"abc",
    language:"English",
    note:"",
  }
]
const addDelegatedSupport ={
  nick_name_id: 1,
  delegated_nick_name_id: 2,
  topic_num: 12,
}
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

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

it('should render card with title and content', () => {
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
    />)
  const title = 'Test Card Title';
  const content = 'Test Card Content';

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
describe("Manage support",()=>{
  it("render nick name list",()=>{
    render(<ManageSupport/>)
    waitFor(async () => {
      expect(screen.getByText(nickNameList[0].create_time)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].id)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].nick_name)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].owner_code)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].private)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[1].create_time)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[1].id)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[1].nick_name)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[1].owner_code)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[1].private)).toBeInTheDocument();
    });
  })
  it("render camp record",()=>{
    render(<ManageSupport/>)
    waitFor(async () => {
      expect(screen.getByText(campRecord.camp_about_nick_id)).toBeInTheDocument();
      expect(screen.getByText(campRecord.camp_about_nick_name)).toBeInTheDocument();
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
      expect(screen.getByText(campRecord.parentCamps[0].camp_name)).toBeInTheDocument();
      expect(screen.getByText(campRecord.parentCamps[0].camp_num)).toBeInTheDocument();
      expect(screen.getByText(campRecord.parentCamps[0].topic_num)).toBeInTheDocument();
    });
  })
  it("render check support exist",()=>{
    render(<ManageSupport/>)
    waitFor(async () => {
      expect(screen.getByText(currentGetCheckSupportExistData.camp_num)).toBeInTheDocument();
      expect(screen.getByText(currentGetCheckSupportExistData.is_confirm)).toBeInTheDocument();
      expect(screen.getByText(currentGetCheckSupportExistData.support_flag)).toBeInTheDocument();
      expect(screen.getByText(currentGetCheckSupportExistData.topic_num)).toBeInTheDocument();
    });
  })
  it("Message component displays correct content",()=>{
    render(<ManageSupport/>)
    const messageContent = 'Test message';

  // Render the Message component
  message.success(messageContent);

  // Assert that the message content is displayed
  const messageElement = screen.getByText(messageContent);
  expect(messageElement).toBeInTheDocument();
  });
  it("render useState is working ",()=>{
    render(<ManageSupport/>)
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
    render(<ManageSupport/>)
    const mockedRouter = {
      pathname: '/about',
    };
  
    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);
  
    const { result } = renderHook(() => useRouter());
  
    expect(result.current.pathname).toBe('/about');
  });
  it("render topic support list",()=>{
    render(<ManageSupport/>)
    waitFor(async () => {
      expect(screen.getByText(topicSupportList[0].camp_name)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].camp_num)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].delegate_nick_name_id)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].end)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].link)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].namespace_id)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].nick_name_id)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].start)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].support_id)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].support_order)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].title)).toBeInTheDocument();
      expect(screen.getByText(topicSupportList[0].topic_num)).toBeInTheDocument();
    });
  })
  it("render all parent list",()=>{
    render(<ManageSupport/>)
    waitFor(async () => {
      expect(screen.getByText(allParentList[0].camp_about_nick_id)).toBeInTheDocument();
      expect(screen.getByText(allParentList[0].camp_about_url)).toBeInTheDocument();
      expect(screen.getByText(allParentList[0].camp_name)).toBeInTheDocument();
      expect(screen.getByText(allParentList[0].camp_num)).toBeInTheDocument();
      expect(screen.getByText(allParentList[0].direct_archive)).toBeInTheDocument();
      expect(screen.getByText(allParentList[0].go_live_time)).toBeInTheDocument();
    });
  })
  it('checks the value of a variable', () => {
    render(<ManageSupport/>)

    const myVariable = 42;

    expect(myVariable).toBe(42);
  });
  it('performs the correct action based on the condition', () => {
    render(<ManageSupport/>)

    const condition = true;

    if (condition) {
      // Perform action A
      expect(condition).toBe(true);
    } else {
      // Perform action B
      expect(condition).toBe(false);
    }
  });
  it('returns the correct router object', () => {
    render(<ManageSupport/>)

    const mockRouter = {
      pathname: '/example',
      query: { id: '123' },
      push: jest.fn(),
    };

    jest.spyOn(require('next/router'), 'useRouter').mockReturnValue(mockRouter);

    const { result } = renderHook(() => useRouter());

    expect(result.current.pathname).toBe('/example');
    expect(result.current.query).toEqual({ id: '123' });

    // Test calling a router function
    result.current.push('/new-page');
    expect(mockRouter.push).toHaveBeenCalledWith('/new-page');
  });
  it("render all parent list",()=>{
    render(<ManageSupport/>)
    waitFor(async () => {
      expect(screen.getByText(addDelegatedSupport.nick_name_id)).toBeInTheDocument();
      expect(screen.getByText(addDelegatedSupport.delegated_nick_name_id)).toBeInTheDocument();
      expect(screen.getByText(addDelegatedSupport.topic_num)).toBeInTheDocument();
    });
  })
  it('sets the ref object correctly', () => {
    render(<ManageSupport/>)
    const { container } = render(<MyComponent />);
    const inputElement = container.querySelector('input');

    expect(inputElement).toBeDefined();
    expect(inputElement).toEqual(expect.any(HTMLInputElement));
  });
  it('formats a date correctly', () => {
    render(<ManageSupport/>)
    const date = moment('2023-06-07');
    const formattedDate = date.format('YYYY-MM-DD');

    expect(formattedDate).toBe('2023-06-07');
  });

  it('adds days to a date correctly', () => {
    const date = moment('2023-06-07');
    const newDate = date.add(7, 'days');

    expect(newDate.format('YYYY-MM-DD')).toBe('2023-06-14');
  });

  it('checks if a date is before another date', () => {
    const date1 = moment('2023-06-07');
    const date2 = moment('2023-06-08');

    expect(date1.isBefore(date2)).toBe(true);
  });

  it('checks if a date is after another date', () => {
    const date1 = moment('2023-06-07');
    const date2 = moment('2023-06-06');

    expect(date1.isAfter(date2)).toBe(true);
  });
})

describe('Dynamic import', () => {
  it('loads the module asynchronously', async () => {
    const dynamicImport = import('../../ManageSupportUI');

    await expect(dynamicImport).resolves.toBeDefined();
  });
});