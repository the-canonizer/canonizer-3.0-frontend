import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "../../../../utils/testUtils";
import userEvent from "@testing-library/user-event";

import ProfileInfoForm from "../../Form/ProfileInfoForm";
import messages from "../../../../messages";

const { labels, placeholders, validations } = messages;
const privateFlags = "first_name";
const onFinish = jest.fn();
const onFinishFailed = jest.fn();
const handleselectAfter = jest.fn();
const handleAddressChange = jest.fn();
const handleAddressSelect = jest.fn();

const algorithmList = [];
const languageList = [];
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
    expect(screen.getByText(labels.middleName)).toBeInTheDocument();
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
    const middleName = screen.getByPlaceholderText(placeholders.middleName);
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

    expect(middleName).toBeInTheDocument();
    expect(middleName).toHaveAttribute("type", "text");
    expect(middleName).toHaveAttribute("placeholder", placeholders.middleName);

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
    expect(screen.getAllByText("Male")).toBeTruthy();
    expect(screen.getAllByText("Female")).toBeTruthy();
    expect(screen.getAllByText("Other")).toBeTruthy();
  });
});
