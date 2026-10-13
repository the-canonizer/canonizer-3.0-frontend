import {
  render,
  screen,
  waitFor,
  cleanup,
  fireEvent,
} from "src/utils/testUtils";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

import Passkeys from "../index";
import messages from "src/messages";
import { deletePasskey, getPasskeys } from "src/network/api/userApi";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";

jest.mock("src/network/api/userApi");
jest.mock("components/common/notification/notificationBar", () => ({
  openNotificationWithIcon: jest.fn(),
}));

const { passkey: copy } = messages;

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
  (browserSupportsWebAuthn as jest.Mock).mockReturnValue(true);
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
    (browserSupportsWebAuthn as jest.Mock).mockReturnValue(false);
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
});
