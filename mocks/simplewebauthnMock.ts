// @simplewebauthn/browser ships an ESM-only bundle that babel-jest does not
// transform; tests override these with jest.mock or mockResolvedValue.
export const browserSupportsWebAuthn = jest.fn(() => false);
export const startAuthentication = jest.fn();
export const startRegistration = jest.fn();
