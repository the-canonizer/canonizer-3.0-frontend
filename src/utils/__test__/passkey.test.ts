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
  afterEach(() => {
    delete (window as any).PublicKeyCredential;
  });

  it("is true when PublicKeyCredential exists", () => {
    (window as any).PublicKeyCredential = function PublicKeyCredential() {};
    expect(isWebAuthnSupported()).toBe(true);
  });

  it("is false without PublicKeyCredential", () => {
    expect(isWebAuthnSupported()).toBe(false);
  });

  it("does not load the WebAuthn library", () => {
    (window as any).PublicKeyCredential = function PublicKeyCredential() {};
    isWebAuthnSupported();
    expect(browserSupportsWebAuthn).not.toHaveBeenCalled();
  });
});
