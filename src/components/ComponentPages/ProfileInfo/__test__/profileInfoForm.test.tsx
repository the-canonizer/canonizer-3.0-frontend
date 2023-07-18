import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ProfileInfoForm from "../../Form/ProfileInfoForm";
import messages from "../../../../messages";
import ProfileInfo from "..";
import { useRouter } from "next/router";
import { act, renderHook } from "@testing-library/react-hooks";
import isAuth from "../../../../hooks/isUserAuthenticated";
import { Input, message } from "antd";
GetAlgorithmsList: jest.fn();
import {
  VerifyOTP,
  GetMobileCarrier,
  GetLanguageList,
  GetAlgorithmsList,
  GetUserProfileInfo,
} from "src/network/api/userApi";
import { useEffect } from "react";

const { labels, placeholders, validations } = messages;
const privateFlags = "first_name";
const onFinish = jest.fn();
const onFinishFailed = jest.fn();
const handleselectAfter = jest.fn();
const handleAddressChange = jest.fn();
const handleAddressSelect = jest.fn();
const userProfileData = {
  address_1: "sector-102,sudo enclave,florida",
  address_2: "sector-102,sudo enclave,florida",
  birthda: null,
  city: "Florida",
  country: "America",
  country_code: null,
  default_algo: "blind_popularity",
  email: "ABC@talentelgia.in",
  fcm_token: null,
  first_name: "ABC",
  gender: "male",
  id: 1,
  is_active: 1,
  join_time: null,
  language: null,
  last_name: "Rana",
  middle_name: null,
  mobile_carrier: null,
  mobile_verified: 0,
  otp: "",
  phone_number: null,
  postal_code: null,
  private_flags: null,
  state: null,
  status: 1,
  type: "user",
  update_time: null,
};

const mobileCarrierData = [
  {
    carrier_address: "abc@gami.com",
    id: 1,
    name: "ABC",
  },
  {
    carrier_address: "def@gami.com",
    id: 2,
    name: "def",
  },
];
const algorithmList = [
  {
    algorithm_key: "blind_popularity",
    algorithm_label: "One Person One Vote",
    id: 1,
  },
  {
    algorithm_key: "mind_experts",
    algorithm_label: "mind experts",
    id: 2,
  },
  {
    algorithm_key: "computer_science_experts",
    algorithm_label: "computer science experts",
    id: 3,
  },
];
const languageList = [
  {
    id: 1,
    name: "English",
  },
  {
    id: 2,
    name: "French",
  },
  {
    id: 3,
    name: "Spain",
  },
];
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("src/network/api/userApi", () => ({
  UpdateUserProfileInfo: jest.fn(() =>
    Promise.resolve({ data: {}, status_code: 200 })
  ),
  SendOTP: jest.fn(() => Promise.resolve({ data: {}, status_code: 200 })),
  GetMobileCarrier: jest.fn(() =>
    Promise.resolve({ data: mobileCarrierData, status_code: 200 })
  ),
  VerifyOTP: jest.fn(() => Promise.resolve({ data: {}, status_code: 200 })),
  GetAlgorithmsList: jest.fn(() =>
    Promise.resolve({ data: algorithmList, status_code: 200 })
  ),
  GetLanguageList: jest.fn(() =>
    Promise.resolve({ data: languageList, status_code: 200 })
  ),
  GetUserProfileInfo: jest.fn().mockReturnValue(
    Promise.resolve({
      data: {
        phone_number: 12321312312,
        mobile_carrier: "sdc",
        birthday: "01-01-20",
        postalCode: 411021,
      },
      success: true,
    })
  ),
  getUploadFileAndFolder: jest.fn(() =>
    Promise.resolve({ data: {}, status_code: 200 })
  ),
}));
jest.mock("src/hooks/isUserAuthenticated", () =>
  jest.fn(() => ({ isUserAuthenticated: true }))
);



const address = "";
const setupGoogleMock = () => {
  /** Mock Google Maps JavaScript API **/
  const google = {
    maps: {
      places: {
        Autocomplete: class {},
        AutocompleteService: class {},
        PlacesServiceStatus: {
          INVALID_REQUEST: "INVALID_REQUEST",
          NOT_FOUND: "NOT_FOUND",
          OK: "OK",
          OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
          REQUEST_DENIED: "REQUEST_DENIED",
          UNKNOWN_ERROR: "UNKNOWN_ERROR",
          ZERO_RESULTS: "ZERO_RESULTS",
        },
      },
      Geocoder: () => {},
      GeocoderStatus: {
        ERROR: "ERROR",
        INVALID_REQUEST: "INVALID_REQUEST",
        OK: "OK",
        OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
        REQUEST_DENIED: "REQUEST_DENIED",
        UNKNOWN_ERROR: "UNKNOWN_ERROR",
        ZERO_RESULTS: "ZERO_RESULTS",
      },
    },
  };
  global.window.google = google;
};

// in test file.
beforeAll(() => {
  setupGoogleMock();
});
describe("Profile Info Page", () => {
  it("render heading and labels Of Profile Info Form", () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={true}
      />
    );

    let heading = screen.getByRole("heading", {
      name: /Personal information/i,
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText(labels.firstName)).toBeInTheDocument();
    expect(screen.getByText(labels.lastName)).toBeInTheDocument();
    expect(screen.getByText(labels.email)).toBeInTheDocument();
    expect(screen.getByText(labels.gender)).toBeInTheDocument();
    expect(screen.getByText(labels.addressLine1)).toBeInTheDocument();
    expect(screen.getByText(labels.addressLine2)).toBeInTheDocument();
    expect(screen.getByText(labels.city)).toBeInTheDocument();
    expect(screen.getByText(labels.state)).toBeInTheDocument();
    expect(screen.getByText(labels.zipCode)).toBeInTheDocument();
    expect(screen.getByText(labels.country)).toBeInTheDocument();
    expect(screen.getByText(labels.language)).toBeInTheDocument();
    expect(screen.getByText(labels.chooseAlgorithm)).toBeInTheDocument();
  });

  it("render inputs field and submit button", () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={false}
      />
    );

    const firstName = screen.getByPlaceholderText(placeholders.firstName);
    const lastName = screen.getByPlaceholderText(placeholders.lastName);
    const email = screen.getByPlaceholderText(placeholders.email);
    const addressLine1 = screen.getByPlaceholderText(placeholders.addressLine1);
    const addressLine2 = screen.getByPlaceholderText(placeholders.addressLine2);
    const city = screen.getByPlaceholderText(placeholders.city);
    const zipCode = screen.getByPlaceholderText(placeholders.zipCode);
    const country = screen.getByPlaceholderText(placeholders.country);
    expect(screen.getByText(labels.language)).toBeInTheDocument();
    //const chooseAlgorithm = screen.getByPlaceholderText(labels.chooseAlgorithm);

    expect(firstName).toBeInTheDocument();
    expect(firstName).toHaveAttribute("type", "text");
    expect(firstName).toHaveAttribute("placeholder", placeholders.firstName);

    expect(lastName).toBeInTheDocument();
    expect(lastName).toHaveAttribute("type", "text");
    expect(lastName).toHaveAttribute("placeholder", placeholders.lastName);

    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute("type", "text");
    expect(email).toHaveAttribute("placeholder", placeholders.email);

    expect(addressLine1).toBeInTheDocument();
    expect(addressLine1).toHaveAttribute("type", "text");
    expect(addressLine1).toHaveAttribute(
      "placeholder",
      placeholders.addressLine1
    );

    expect(addressLine2).toBeInTheDocument();
    expect(addressLine2).toHaveAttribute("type", "text");
    expect(addressLine2).toHaveAttribute(
      "placeholder",
      placeholders.addressLine2
    );

    expect(city).toBeInTheDocument();
    expect(city).toHaveAttribute("type", "text");
    expect(city).toHaveAttribute("placeholder", placeholders.city);

    expect(zipCode).toBeInTheDocument();
    expect(zipCode).toHaveAttribute("type", "text");
    expect(zipCode).toHaveAttribute("placeholder", placeholders.zipCode);

    expect(country).toBeInTheDocument();
    expect(country).toHaveAttribute("type", "text");
    expect(country).toHaveAttribute("placeholder", placeholders.country);
  });

  it("blank Profile info form should not be submit", async () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={false}
      />
    );
    const btnEl = screen.getByTestId("submitButton");

    userEvent.click(btnEl);

    await waitFor(() => {
      expect(screen.queryByText(validations.firstName)).toBeVisible();
      expect(screen.queryByText(validations.lastName)).toBeVisible();
      expect(screen.queryByText(validations.email)).toBeVisible();
    });
  });

  it("render update button", () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={false}
      />
    );
    expect(
      screen.getAllByText("Update")[0] as HTMLButtonElement
    ).toBeInTheDocument();
  });

  it("render *", () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={false}
      />
    );
    expect(screen.getAllByText("*")).toBeTruthy();
  });

  it("render update button", () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={false}
      />
    );
    expect(screen.getAllByText("*")).toBeTruthy();
  });

  // it("radio",  () => {

  //   const { getByLabelText }= render(
  //     <form>
  //     <label>
  //        Male <input type="radio" name="radio1" value="male" />
  //     </label>
  //     <label>
  //       Female <input type="radio" name="radio1" value="female" />
  //     </label>
  //   </form>
  //   );

  //   const radio = getByLabelText('First')
  // fireEvent.change(radio, { target: { value: "female" } });
  // expect(radio.)value).toBe('female')

  // });

  it("render gender label", () => {
    render(
      <ProfileInfoForm
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        handleselectAfter={handleselectAfter}
        privateFlags={privateFlags}
        algorithmList={algorithmList}
        languageList={languageList}
        handleAddressChange={handleAddressChange}
        handleAddressSelect={handleAddressSelect}
        address={address}
        disableButton={false}
      />
    );
    expect(screen.getAllByText("Male")).toBeTruthy();
    expect(screen.getAllByText("Female")).toBeTruthy();
    expect(screen.getAllByText("Other")).toBeTruthy();
  });
});

describe("UserProfile", () => {
  it("render algorithim list", () => {
    render(<ProfileInfo />);
    waitFor(async () => {
      expect(
        screen.getByText(algorithmList[0].algorithm_key)
      ).toBeInTheDocument();
      expect(
        screen.getByText(algorithmList[0].algorithm_label)
      ).toBeInTheDocument();
      expect(screen.getByText(algorithmList[0].id)).toBeInTheDocument();
    });
  });

  it("render language list", () => {
    render(<ProfileInfo />);
    waitFor(async () => {
      expect(screen.getByText(languageList[0].id)).toBeInTheDocument();
      expect(screen.getByText(languageList[0].name)).toBeInTheDocument();
      expect(screen.getByText(languageList[1].id)).toBeInTheDocument();
      expect(screen.getByText(languageList[1].name)).toBeInTheDocument();
      expect(screen.getByText(languageList[2].id)).toBeInTheDocument();
      expect(screen.getByText(languageList[2].name)).toBeInTheDocument();
    });
  });

  it("render Profile data", () => {
    render(<ProfileInfo />);
    waitFor(async () => {
      expect(screen.getByText(userProfileData.address_1)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.address_2)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.birthda)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.city)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.country)).toBeInTheDocument();
      expect(
        screen.getByText(userProfileData.country_code)
      ).toBeInTheDocument();
      expect(
        screen.getByText(userProfileData.default_algo)
      ).toBeInTheDocument();
      expect(screen.getByText(userProfileData.email)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.fcm_token)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.first_name)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.gender)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.id)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.is_active)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.join_time)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.language)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.last_name)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.middle_name)).toBeInTheDocument();
      expect(
        screen.getByText(userProfileData.mobile_carrier)
      ).toBeInTheDocument();
      expect(
        screen.getByText(userProfileData.mobile_verified)
      ).toBeInTheDocument();
      expect(screen.getByText(userProfileData.otp)).toBeInTheDocument();
      expect(
        screen.getByText(userProfileData.phone_number)
      ).toBeInTheDocument();
      expect(screen.getByText(userProfileData.postal_code)).toBeInTheDocument();
      expect(
        screen.getByText(userProfileData.private_flags)
      ).toBeInTheDocument();
      expect(screen.getByText(userProfileData.state)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.status)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.update_time)).toBeInTheDocument();
      expect(screen.getByText(userProfileData.type)).toBeInTheDocument();

      expect(screen.getByText("Update")).toBeInTheDocument();
    });
  });
  it("render mobile carrier data", () => {
    render(<ProfileInfo />);
    waitFor(async () => {
      expect(
        screen.getByText(mobileCarrierData[0].carrier_address)
      ).toBeInTheDocument();
      expect(screen.getByText(mobileCarrierData[0].id)).toBeInTheDocument();
      expect(screen.getByText(mobileCarrierData[0].name)).toBeInTheDocument();
      expect(
        screen.getByText(mobileCarrierData[1].carrier_address)
      ).toBeInTheDocument();
      expect(screen.getByText(mobileCarrierData[1].id)).toBeInTheDocument();
      expect(screen.getByText(mobileCarrierData[1].name)).toBeInTheDocument();
    });
  });

  it("path is working with use router", () => {
    render(<ProfileInfo />);
    const mockedRouter = {
      pathname: "/about",
    };

    // Setting up the mocked useRouter implementation
    useRouter.mockImplementation(() => mockedRouter);

    const { result } = renderHook(() => useRouter());

    expect(result.current.pathname).toBe("/about");
  });
  it("Input component handles user input correctly", () => {
    // Render the Input component
    render(<Input />);

    // Find the input element
    const inputElement = screen.getByRole("textbox");

    // Simulate user input
    const userInput = "Test Input";
    fireEvent.change(inputElement, { target: { value: userInput } });

    // Assert that the input value is updated
    expect(inputElement.value).toBe(userInput);
  });
});
