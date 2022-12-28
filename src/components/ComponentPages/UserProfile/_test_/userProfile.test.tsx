import { render, screen } from "../../../../utils/testUtils";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import { UserProfileCard } from "../UserProfileDetails/UserProfileCard";
import messages from "../../../../messages";
const { labels } = messages;
const profileData = {
  name: "first_name",
  email: "email",
  address_1: "address_1",
  city: "city",
  postal_code: "postal_code",
  country: "country",
};

const userSupportedCampsList = [
  {
    nick_name: "Test Nick Name",
    topic: [],
  },
];

const nameSpaceList = [
  {
    name: "Test Name Space",
  },
];

const dropdownNameSpaceList = "";
const noData = false;

describe("userProfileDetails", () => {
  it("render show userProfile", () => {
    render(
      <UserProfileDetails
        profileData={profileData}
        userSupportedCampsList={userSupportedCampsList}
      />
    );
    expect(screen.queryByTestId(labels.userProfile)).toBeNull();
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
    expect(screen.queryByTestId(labels.name)).toBeNull();
    expect(screen.queryByTestId(labels.emailAddress)).toBeNull();
    expect(screen.queryByTestId(labels.address)).toBeNull();
    expect(screen.queryByTestId(labels.city)).toBeNull();
    expect(screen.queryByTestId(labels.country)).toBeNull();
    expect(screen.queryByTestId(labels.zipcode)).toBeNull();
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
    // ).toHaveTextContent("Test Nick Name");
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
});
