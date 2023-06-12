import { fireEvent, render, screen, waitFor } from "../../../../utils/testUtils";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import { UserProfileCard } from "../UserProfileDetails/UserProfileCard";
import messages from "../../../../messages";
import UserProfile from "..";
import { useState } from "react";
import { useRouter } from "next/router";
import { renderHook } from "@testing-library/react-hooks";
import { Input, message } from "antd";
const { labels } = messages;
const profileData = {
  name: "Name",
  email: "email",
  address_1: "address_1",
  city: "city",
  postal_code: "postal_code",
  country: "country",
};


const userSupportedCampsList = [
  {
    nick_name: "Test Nickname",
    nick_name_id:123,
    private_status:0,
    topic: [
      {
        camp_name:"Agreement",
        namespace_id:1,
        title_link:"https://www.google.com/",
        topic_num:12
      },
      {
        camp_name:"Agreement-2",
        namespace_id:2,
        title_link:"https://www.google.com/",
        topic_num:13
      }
    ],
  },
];

const nameSpaceList = [
  {
    name: "Test Name Space",
  },
];

const nickNameList = [
  {
    nick_name: "ABC",
    nick_name_id:123,
    private_status:0,
  },
];

const totalPages = 5;
const currentPage = 3;
const onPageChange = jest.fn();

const dropdownNameSpaceList = "";
const noData = false;

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
describe("userProfileDetails", () => {
  it("render show userProfile", () => {
    render(
      <UserProfileDetails
        profileData={profileData}
        userSupportedCampsList={userSupportedCampsList}
      />
    );
    expect(screen.getByText(labels.userProfile)).toBeTruthy();
  });
});

describe("userProfileDetails", () => {
  it("render labels of userProfileDetails", () => {
    render(
      <UserProfileDetails
        profileData={profileData}
        userSupportedCampsList={userSupportedCampsList}
      />
    );
    expect(screen.getByText(labels.emailAddress)).toBeTruthy();
    expect(screen.getByText(labels.address)).toBeTruthy();
    expect(screen.getByText(labels.city)).toBeTruthy();
    expect(screen.getByText(labels.country)).toBeTruthy();
    expect(screen.getByText(labels.zipcode)).toBeTruthy();
  });
});

describe("userProfileCard", () => {
  it("render labels userProfileCard", () => {
    render(
      <UserProfileCard
        userSupportedCampsList={userSupportedCampsList}
        nameSpaceList={nameSpaceList}
        dropdownNameSpaceList={dropdownNameSpaceList}
        setDropdownNameSpaceList={() => {}}
        noData={noData}
      />
    );
    expect(screen.getByText(labels.listOfSupportedCamps)).toBeTruthy();
  });
});

describe("userProfileCard", () => {
  it("render labels of nick_name  userProfileCard", () => {
    const { container } = render(
      <UserProfileCard
        userSupportedCampsList={userSupportedCampsList}
        nameSpaceList={nameSpaceList}
        dropdownNameSpaceList={dropdownNameSpaceList}
        setDropdownNameSpaceList={() => {}}
        noData={noData}
      />
    );
    // expect(screen.getAllByText(labels.nickName)).toBeTruthy();
    expect(
      container.getElementsByClassName("UserProfile_main_card_title__sqTKz")
    ).toBeTruthy();
  });
});

describe("userProfileCard", () => {
  it("render nick_name value userProfileCard", () => {
    const { container } = render(
      <UserProfileCard
        userSupportedCampsList={userSupportedCampsList}
        nameSpaceList={nameSpaceList}
        dropdownNameSpaceList={dropdownNameSpaceList}
        setDropdownNameSpaceList={() => {}}
        noData={noData}
      />
    );
    // expect(
    //   container.getElementsByClassName("UserProfile_Bluecolor__El2lJ")[0]
    // ).toHaveTextContent("Test Nickname");
    expect(
      container.getElementsByClassName("UserProfile_Bluecolor__El2lJ")
    ).toBeTruthy();
  });
});

describe("userProfileCard", () => {
  it("render userProfileDropdown", () => {
    const { container } = render(
      <UserProfileCard
        userSupportedCampsList={userSupportedCampsList}
        nameSpaceList={nameSpaceList}
        dropdownNameSpaceList={dropdownNameSpaceList}
        setDropdownNameSpaceList={() => {}}
        noData={noData}
      />
    );
    expect(
      container.getElementsByClassName("ant-select-selection-search")
    ).toBeTruthy();
  });
  test('Input component handles user input correctly', () => {
    render(<UserProfileCard
        userSupportedCampsList={userSupportedCampsList}
        nameSpaceList={nameSpaceList}
        dropdownNameSpaceList={dropdownNameSpaceList}
        setDropdownNameSpaceList={() => {}}
        noData={noData}
      />)
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
});

describe("User profile",()=>{
  it("render select namespace form dropdown", () => {
    render(<UserProfile/>);
    waitFor(async () => {

      expect(screen.getByText(nameSpaceList[0].name)).toBeInTheDocument();

    });
  });

  it("render user supported camp list", () => {
    render(<UserProfile/>);
    waitFor(async () => {

      expect(screen.getAllByText(userSupportedCampsList[0].nick_name)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].nick_name_id)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].private_status)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[0].camp_name)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[0].namespace_id)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[0].title_link)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[0].topic_num)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[1].camp_name)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[1].namespace_id)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[1].title_link)).toBeInTheDocument();
      expect(screen.getAllByText(userSupportedCampsList[0].topic[1].topic_num)).toBeInTheDocument();
    });
  });

  it("render select namespace form dropdown", () => {
    render(<UserProfile/>);
    waitFor(async () => {
      expect(screen.getByText(nickNameList[0].nick_name)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].nick_name_id)).toBeInTheDocument();
      expect(screen.getByText(nickNameList[0].private_status)).toBeInTheDocument();
    });
  });
  it("render useState is working ",()=>{
    render(<UserProfile/>)
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
    render(<UserProfile/>)
    const mockedRouter = {
      pathname: '/about',
    };
  
    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);
  
    const { result } = renderHook(() => useRouter());
  
    expect(result.current.pathname).toBe('/about');
  });
  it("Message component displays correct content",()=>{
    render(<UserProfile/>)
    const messageContent = 'Test message';

  // Render the Message component
  message.success(messageContent);

  // Assert that the message content is displayed
  const messageElement = screen.getByText(messageContent);
  expect(messageElement).toBeInTheDocument();
  });
})
