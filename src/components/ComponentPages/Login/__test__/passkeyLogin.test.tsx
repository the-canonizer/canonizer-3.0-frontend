import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "src/utils/testUtils";
import { Provider } from "react-redux";
import { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";
import configureMockStore from "redux-mock-store";
import { startAuthentication } from "@simplewebauthn/browser";

import Login from "../index";
import PasskeyLoginButton from "../UI/passkeyLoginButton";
import messages from "src/messages";
import {
  passkeyLoginOptions,
  passkeyLoginVerify,
} from "src/network/api/userApi";

jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

jest.mock("src/network/api/userApi");

const { errors } = messages.passkey;

const setWebAuthnSupport = (supported: boolean) => {
  if (supported) {
    (window as any).PublicKeyCredential = function PublicKeyCredential() {};
  } else {
    delete (window as any).PublicKeyCredential;
  }
};

const createMockRouter = (router: Partial<NextRouter> = {}): NextRouter =>
  ({
    basePath: "",
    pathname: "/login",
    route: "/login",
    query: {},
    asPath: "/login",
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(() => Promise.resolve()),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...router,
  } as NextRouter);

const store = configureMockStore()({
  auth: { authenticated: false, loggedInUser: {} },
  utils: { remember_me: { email: "", password: "" } },
});

const renderLogin = (router = createMockRouter()) =>
  render(
    <Provider store={store}>
      <RouterContext.Provider value={router}>
        <Login />
      </RouterContext.Provider>
    </Provider>
  );

afterEach(cleanup);

beforeEach(() => {
  jest.clearAllMocks();
  setWebAuthnSupport(true);
});

describe("PasskeyLoginButton", () => {
  it("is hidden when WebAuthn is not supported", async () => {
    setWebAuthnSupport(false);
    render(<PasskeyLoginButton onClick={jest.fn()} />);

    expect(screen.queryByTestId("passkey-login-btn")).not.toBeInTheDocument();
    expect(screen.queryByText(messages.passkey.signIn)).not.toBeInTheDocument();
  });

  it("renders and fires onClick when WebAuthn is supported", async () => {
    const onClick = jest.fn();
    render(<PasskeyLoginButton onClick={onClick} />);

    const btn = await screen.findByTestId("passkey-login-btn");
    expect(btn).toHaveTextContent(messages.passkey.signIn);

    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Login with passkey", () => {
  const options = { challenge: "abc" };

  beforeEach(() => {
    (passkeyLoginOptions as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: { challenge_id: "c1", options },
    });
  });

  it("does not show the passkey button when unsupported", async () => {
    setWebAuthnSupport(false);
    renderLogin();

    expect(screen.queryByTestId("passkey-login-btn")).not.toBeInTheDocument();
  });

  it("verifies the credential and redirects on success", async () => {
    const router = createMockRouter();
    const credential = { id: "cred" };
    (startAuthentication as jest.Mock).mockResolvedValue(credential);
    (passkeyLoginVerify as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: { user: { email: "a@b.com", default_algo: "blind_popularity" } },
    });
    renderLogin(router);

    fireEvent.click(await screen.findByTestId("passkey-login-btn"));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith("/"));
    expect(passkeyLoginOptions).toHaveBeenCalledWith();
    expect(startAuthentication).toHaveBeenCalledWith(options);
    expect(passkeyLoginVerify).toHaveBeenCalledWith({
      challenge_id: "c1",
      credential,
    });
  });

  it("shows the cancelled message when the user dismisses the prompt", async () => {
    (startAuthentication as jest.Mock).mockRejectedValue(
      Object.assign(new Error("dismissed"), { name: "NotAllowedError" })
    );
    renderLogin();

    fireEvent.click(await screen.findByTestId("passkey-login-btn"));

    expect(await screen.findByText(errors.cancelled)).toBeInTheDocument();
    expect(passkeyLoginVerify).not.toHaveBeenCalled();
  });

  it("shows the API message when verification is rejected", async () => {
    (startAuthentication as jest.Mock).mockResolvedValue({ id: "cred" });
    (passkeyLoginVerify as jest.Mock).mockRejectedValue({
      error: { data: { message: "Passkey not recognised" } },
    });
    renderLogin();

    fireEvent.click(await screen.findByTestId("passkey-login-btn"));

    expect(
      await screen.findByText("Passkey not recognised")
    ).toBeInTheDocument();
  });

  it("falls back to the generic message for a non-200 response", async () => {
    (startAuthentication as jest.Mock).mockResolvedValue({ id: "cred" });
    (passkeyLoginVerify as jest.Mock).mockResolvedValue({ status_code: 400 });
    renderLogin();

    fireEvent.click(await screen.findByTestId("passkey-login-btn"));

    expect(await screen.findByText(errors.loginFailed)).toBeInTheDocument();
  });

  it("does not send the email even when the email field is filled", async () => {
    (startAuthentication as jest.Mock).mockResolvedValue({ id: "cred" });
    (passkeyLoginVerify as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: { user: { email: "a@b.com" } },
    });
    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText(messages.placeholders.emailPhone),
      { target: { value: "typed@example.com" } }
    );
    fireEvent.click(await screen.findByTestId("passkey-login-btn"));

    await waitFor(() => expect(passkeyLoginVerify).toHaveBeenCalled());
    expect(passkeyLoginOptions).toHaveBeenCalledTimes(1);
    expect(passkeyLoginOptions).toHaveBeenCalledWith();
  });

  it("uses the unverified-account path for a 402", async () => {
    const router = createMockRouter();
    (startAuthentication as jest.Mock).mockResolvedValue({ id: "cred" });
    (passkeyLoginVerify as jest.Mock).mockResolvedValue({
      status_code: 402,
      message: "Please verify your email first.",
    });
    renderLogin(router);

    fireEvent.click(await screen.findByTestId("passkey-login-btn"));

    expect(
      await screen.findByText("Please verify your email first.")
    ).toBeInTheDocument();
    expect(screen.queryByText(errors.loginFailed)).not.toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  describe("current_user cookie", () => {
    let cookieWrites: string[];

    beforeEach(() => {
      cookieWrites = [];
      jest
        .spyOn(document, "cookie", "set")
        .mockImplementation((v: string) => {
          cookieWrites.push(v);
        });
      (startAuthentication as jest.Mock).mockResolvedValue({ id: "cred" });
    });

    afterEach(() => jest.restoreAllMocks());

    const currentUserWrites = () =>
      cookieWrites.filter((c) => c.startsWith("current_user="));

    it("writes the user's email", async () => {
      (passkeyLoginVerify as jest.Mock).mockResolvedValue({
        status_code: 200,
        data: { user: { email: "a@b.com" } },
      });
      renderLogin();

      fireEvent.click(await screen.findByTestId("passkey-login-btn"));

      await waitFor(() => expect(currentUserWrites()).toHaveLength(1));
      expect(currentUserWrites()[0]).toMatch(/^current_user=a@b\.com/);
    });

    it("never writes 'undefined' when the email is missing", async () => {
      (passkeyLoginVerify as jest.Mock).mockResolvedValue({
        status_code: 200,
        data: { user: {} },
      });
      renderLogin();

      fireEvent.click(await screen.findByTestId("passkey-login-btn"));

      await waitFor(() => expect(currentUserWrites()).toHaveLength(1));
      expect(currentUserWrites()[0]).not.toContain("undefined");
    });

    it("does not sign in when the user is missing", async () => {
      const router = createMockRouter();
      (passkeyLoginVerify as jest.Mock).mockResolvedValue({
        status_code: 200,
        data: {},
      });
      renderLogin(router);

      fireEvent.click(await screen.findByTestId("passkey-login-btn"));

      expect(await screen.findByText(errors.loginFailed)).toBeInTheDocument();
      expect(currentUserWrites()).toHaveLength(0);
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
