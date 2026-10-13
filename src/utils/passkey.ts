import messages from "src/messages";

// @simplewebauthn/browser is ESM-only and browser-only, so load it lazily on
// the client instead of letting Next 12 externalise it for SSR
export const loadWebAuthn = () => import("@simplewebauthn/browser");

export const isWebAuthnSupported = async () => {
  if (typeof window === "undefined") return false;
  const { browserSupportsWebAuthn } = await loadWebAuthn();
  return browserSupportsWebAuthn();
};

// Maps WebAuthn DOMExceptions and API envelope errors to a user-facing message
export const getPasskeyErrorMessage = (error, fallback: string) => {
  const { errors } = messages.passkey;

  switch (error?.name) {
    case "NotAllowedError":
    case "AbortError":
      return errors.cancelled;
    case "InvalidStateError":
      return errors.alreadyRegistered;
    case "SecurityError":
      return errors.security;
  }

  const apiError = error?.error?.data;

  if (apiError) {
    if (apiError.error && typeof apiError.error === "object") {
      const first = Object.values(apiError.error)[0];
      if (Array.isArray(first) && first[0]) return first[0];
    }
    if (apiError.message) return apiError.message;
  }

  return fallback;
};
