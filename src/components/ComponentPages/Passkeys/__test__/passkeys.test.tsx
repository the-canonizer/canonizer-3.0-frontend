import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "src/utils/testUtils";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { startRegistration } from "@simplewebauthn/browser";

import Passkeys from "../index";
import messages from "src/messages";
import {
  deletePasskey,
  getPasskeys,
  passkeyRegisterOptions,
  passkeyRegisterVerify,
} from "src/network/api/userApi";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

jest.mock("src/network/api/userApi");
jest.mock("components/common/notification/notificationBar", () => ({
  openNotificationWithIcon: jest.fn(),
}));

const { passkey: copy } = messages;

const setWebAuthnSupport = (supported: boolean) => {
  if (supported) {
    (window as any).PublicKeyCredential = function PublicKeyCredential() {};
  } else {
    delete (window as any).PublicKeyCredential;
  }
};

const store = configureMockStore()({
  auth: { authenticated: true, loggedInUser: { id: 1 } },
});

const list = [
  {
    id: 11,
    label: "Work laptop",
    created_at: "2026-10-01T10:00:00Z",
    last_used_at: null,
  },
  {
    id: 12,
    label: null,
    created_at: "2026-10-02T10:00:00Z",
    last_used_at: "2026-10-03T10:00:00Z",
  },
];

const renderPasskeys = () =>
  render(
    <Provider store={store}>
      <Passkeys />
    </Provider>
  );

afterEach(cleanup);

beforeEach(() => {
  jest.clearAllMocks();
  setWebAuthnSupport(true);
  (getPasskeys as jest.Mock).mockResolvedValue({
    status_code: 200,
    data: list,
  });
});

describe("Passkeys settings section", () => {
  it("lists registered passkeys", async () => {
    renderPasskeys();

    expect(await screen.findByText("Work laptop")).toBeInTheDocument();
    expect(screen.getByText(copy.unnamed)).toBeInTheDocument();
    expect(screen.getAllByTestId("passkey-item")).toHaveLength(2);
    expect(screen.getByText(copy.never)).toBeInTheDocument();
    expect(screen.getByTestId("passkey-register-btn")).toBeInTheDocument();
  });

  it("shows the empty state when there are no passkeys", async () => {
    (getPasskeys as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: [],
    });
    renderPasskeys();

    expect(await screen.findByText(copy.empty)).toBeInTheDocument();
  });

  it("replaces the register button when WebAuthn is unsupported", async () => {
    setWebAuthnSupport(false);
    renderPasskeys();

    expect(await screen.findByText(copy.notSupported)).toBeInTheDocument();
    expect(
      screen.queryByTestId("passkey-register-btn")
    ).not.toBeInTheDocument();
  });

  it("notifies when the list fails to load", async () => {
    (getPasskeys as jest.Mock).mockRejectedValue(new Error("network"));
    renderPasskeys();

    await waitFor(() =>
      expect(openNotificationWithIcon).toHaveBeenCalledWith(
        copy.errors.loadFailed
      )
    );
  });

  it("revokes a passkey after confirmation", async () => {
    (deletePasskey as jest.Mock).mockResolvedValue({
      status_code: 200,
      message: "Passkey removed.",
    });
    renderPasskeys();

    fireEvent.click(
      await screen.findByRole("button", { name: `${copy.remove} Work laptop` })
    );
    fireEvent.click(await screen.findByRole("button", { name: copy.yes }));

    await waitFor(() => expect(deletePasskey).toHaveBeenCalledWith(11));
    await waitFor(() =>
      expect(screen.queryByText("Work laptop")).not.toBeInTheDocument()
    );
    expect(screen.getAllByTestId("passkey-item")).toHaveLength(1);
  });

  it("keeps the passkey and notifies when revoke fails", async () => {
    (deletePasskey as jest.Mock).mockRejectedValue({
      error: { data: { message: "Cannot remove your only sign-in method" } },
    });
    renderPasskeys();

    fireEvent.click(
      await screen.findByRole("button", { name: `${copy.remove} Work laptop` })
    );
    fireEvent.click(await screen.findByRole("button", { name: copy.yes }));

    await waitFor(() =>
      expect(openNotificationWithIcon).toHaveBeenCalledWith(
        "Cannot remove your only sign-in method"
      )
    );
    expect(screen.getByText("Work laptop")).toBeInTheDocument();
  });

  const openRegisterModal = async () => {
    fireEvent.click(await screen.findByTestId("passkey-register-btn"));
    return screen.findByRole("dialog");
  };

  const submitLabel = async (label: string) => {
    fireEvent.change(screen.getByLabelText(copy.labelField), {
      target: { value: label },
    });
    fireEvent.click(screen.getByRole("button", { name: copy.continue }));
  };

  it("registers with a trimmed label, closes the modal and refreshes", async () => {
    const credential = { id: "new-cred" };
    (passkeyRegisterOptions as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: { challenge: "xyz" },
    });
    (startRegistration as jest.Mock).mockResolvedValue(credential);
    (passkeyRegisterVerify as jest.Mock).mockResolvedValue({
      status_code: 200,
    });
    renderPasskeys();

    await openRegisterModal();
    await waitFor(() => expect(getPasskeys).toHaveBeenCalledTimes(1));
    await submitLabel("  My phone  ");

    await waitFor(() =>
      expect(passkeyRegisterVerify).toHaveBeenCalledWith({
        credential,
        label: "My phone",
      })
    );
    await waitFor(() => expect(getPasskeys).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("omits a blank label so the backend stores null", async () => {
    const credential = { id: "new-cred" };
    (passkeyRegisterOptions as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: {},
    });
    (startRegistration as jest.Mock).mockResolvedValue(credential);
    (passkeyRegisterVerify as jest.Mock).mockResolvedValue({
      status_code: 200,
    });
    renderPasskeys();

    await openRegisterModal();
    await submitLabel("   ");

    await waitFor(() =>
      expect(passkeyRegisterVerify).toHaveBeenCalledWith({ credential })
    );
  });

  it("maps InvalidStateError to the already-registered message", async () => {
    (passkeyRegisterOptions as jest.Mock).mockResolvedValue({
      status_code: 200,
      data: {},
    });
    (startRegistration as jest.Mock).mockRejectedValue(
      Object.assign(new Error("exists"), { name: "InvalidStateError" })
    );
    renderPasskeys();

    await openRegisterModal();
    await submitLabel("Laptop");

    await waitFor(() =>
      expect(openNotificationWithIcon).toHaveBeenCalledWith(
        copy.errors.alreadyRegistered
      )
    );
    expect(passkeyRegisterVerify).not.toHaveBeenCalled();
  });
});
