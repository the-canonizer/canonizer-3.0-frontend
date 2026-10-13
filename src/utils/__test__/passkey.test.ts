import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

import messages from "src/messages";
import { getPasskeyErrorMessage, isWebAuthnSupported } from "../passkey";

const { errors } = messages.passkey;
const fallback = "fallback message";

describe("getPasskeyErrorMessage", () => {
  it.each([
    ["NotAllowedError", errors.cancelled],
    ["AbortError", errors.cancelled],
    ["InvalidStateError", errors.alreadyRegistered],
    ["SecurityError", errors.security],
  ])("maps the %s DOMException", (name, expected) => {
    expect(getPasskeyErrorMessage({ name }, fallback)).toBe(expected);
  });

  it("uses the first field validation error from the API envelope", () => {
    const error = {
      error: {
        data: {
          message: "Validation failed",
          error: { email: ["The email field is required."] },
        },
      },
    };

    expect(getPasskeyErrorMessage(error, fallback)).toBe(
      "The email field is required."
    );
  });

  it("uses the API message when there are no field errors", () => {
    const error = { error: { data: { message: "Challenge expired" } } };

    expect(getPasskeyErrorMessage(error, fallback)).toBe("Challenge expired");
  });

  it("falls back for unknown errors", () => {
    expect(getPasskeyErrorMessage(new Error("boom"), fallback)).toBe(fallback);
    expect(getPasskeyErrorMessage(undefined, fallback)).toBe(fallback);
  });
});

describe("isWebAuthnSupported", () => {
  it("reflects browserSupportsWebAuthn", async () => {
    (browserSupportsWebAuthn as jest.Mock).mockReturnValueOnce(true);
    await expect(isWebAuthnSupported()).resolves.toBe(true);

    (browserSupportsWebAuthn as jest.Mock).mockReturnValueOnce(false);
    await expect(isWebAuthnSupported()).resolves.toBe(false);
  });
});
