import messages from "src/messages";

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
