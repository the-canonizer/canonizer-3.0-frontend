import NetworkCall from "src/network/networkCall";
import UserRequest from "src/network/request/userRequest";
import { passkeyLoginOptions, passkeyLoginVerify } from "../userApi";

jest.mock("src/network/networkCall", () => ({
  __esModule: true,
  default: { fetch: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

describe("passkeyLoginOptions", () => {
  it("sends an empty body", async () => {
    const spy = jest.spyOn(UserRequest, "passkeyLoginOptions");
    (NetworkCall.fetch as jest.Mock).mockResolvedValue({ status_code: 200 });

    await passkeyLoginOptions();

    expect(spy).toHaveBeenCalledWith({}, undefined);
  });
});

describe("passkeyLoginVerify", () => {
  const body = { challenge_id: "c1", credential: {} };

  it("returns the envelope for an unverified account (402)", async () => {
    const envelope = { status_code: 402, message: "Verify your email" };
    (NetworkCall.fetch as jest.Mock).mockRejectedValue({
      error: { data: envelope },
    });

    await expect(passkeyLoginVerify(body)).resolves.toEqual(envelope);
  });

  it("rethrows other errors, e.g. an unknown credential (400)", async () => {
    const err = { error: { data: { status_code: 400, message: "Unknown" } } };
    (NetworkCall.fetch as jest.Mock).mockRejectedValue(err);

    await expect(passkeyLoginVerify(body)).rejects.toBe(err);
  });
});
