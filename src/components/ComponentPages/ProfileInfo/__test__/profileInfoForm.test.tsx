import { render, screen, waitFor } from "../../../../utils/testUtils";
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
        disableButton={true}
      />
    );
    const firstName = screen.getByLabelText(labels.firstName);
    const middleName = screen.getByLabelText(labels.middleName);
    const lastName = screen.getByLabelText(labels.lastName);
    const email = screen.getByLabelText(labels.email);
    const addressLine1 = screen.getByLabelText(labels.addressLine1);
    const addressLine2 = screen.getByLabelText(labels.addressLine2);
    const city = screen.getByLabelText(labels.city);
    const zipCode = screen.getByLabelText(labels.zipCode);
    const country = screen.getByLabelText(labels.country);
    const language = screen.getByLabelText(labels.language);
    const chooseAlgorithm = screen.getByLabelText(labels.chooseAlgorithm);

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

    expect(language).toBeInTheDocument();
    expect(language).toHaveAttribute("type", "search");

    expect(chooseAlgorithm).toBeInTheDocument();
    expect(chooseAlgorithm).toHaveAttribute("type", "search");
  });

  it("pass valid email to test email input field", async () => {
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
    const inputEl = screen.getByLabelText(labels.email);
    userEvent.type(inputEl, "canonizer@gmail.com");
    await waitFor(() => {
      expect(inputEl).toHaveValue("canonizer@gmail.com");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should show error when invalid email enter in field", async () => {
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
    const inputEl = screen.getByLabelText(labels.email);
    userEvent.type(inputEl, "canonizer.gmail.com");
    await waitFor(() => {
      expect(
        screen.queryByText("The input is not valid E-mail!")
      ).toBeVisible();
    });
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
        disableButton={true}
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
});
