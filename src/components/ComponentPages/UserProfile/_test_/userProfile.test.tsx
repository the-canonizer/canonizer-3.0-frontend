import { render, screen, waitFor } from "../../../../utils/testUtils";
import UserProfileDetails from "../UserProfileDetails/UserProfileDetails";
import UserProfileCard from "../UserProfileDetails/UserProfileCard";
import messages from "../../../../messages";
import UserProfile from "../UserProfileUI";
import { Container } from "postcss";

const { labels } = messages;

describe("userProfileDetails", () => {
  it("render show userProfile", () => {
    render(<UserProfileDetails />);
    expect(screen.getByText(labels.userProfile)).toBeTruthy();
  });
});

describe("userProfileDetails", () => {
  it("render userProfileDetails", () => {
    render(<UserProfileDetails />);
    expect(screen.getByText(labels.name)).toBeTruthy();
    expect(screen.getByText(labels.email)).toBeTruthy();
    expect(screen.getByText(labels.address)).toBeTruthy();
    expect(screen.getByText(labels.city)).toBeTruthy();
    expect(screen.getByText(labels.country)).toBeTruthy();
    expect(screen.getByText(labels.zipCode)).toBeTruthy();
  });
});

describe("userProfileCard", () => {
  it("render userProfileCard", () => {
    render(<UserProfileCard />);
    expect(screen.getByText(labels.listOfSupportedCamps)).toBeTruthy();
  });
});

describe("userProfileCard", () => {
  it("render userProfileDropdown", () => {
    const { container } = render(<UserProfileCard />);
    expect(
      container.getElementsByClassName("ant-select-selection-search")
    ).toBeTruthy();
  });
});
