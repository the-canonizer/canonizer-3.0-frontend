// authSlice.test.js
import authReducer, {
  setAuthToken,
  removeAuthToken,
  setProfilePicture,
  setLoggedInUser,
  logoutUser,
  setSocialUsers,
  removeSocialUsers,
  setLogout,
} from "../authSlice"; // Replace with the path to your slice file

describe("authSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      id: null,
      loggedInUser: null,
      authenticated: false,

      token: "",
      authRefreshToken: null,
      permissions: [""],
      socialUsers: [],
    };
  });

  it("should handle setAuthToken", () => {
    const newState = authReducer(initialState, setAuthToken("newToken"));
    expect(newState.token).toEqual("newToken");
  });

  it("should handle removeAuthToken", () => {
    const stateWithToken = { ...initialState, authToken: "existingToken" };
    const newState = authReducer(stateWithToken, removeAuthToken());
    expect(newState.token).toEqual(null);
  });

  it("should handle setProfilePicture", () => {
    const stateWithUser = {
      ...initialState,
      loggedInUser: { profile_picture: "oldPicture" },
    };
    const newState = authReducer(
      stateWithUser,
      setProfilePicture("newPicture")
    );
    expect(newState.loggedInUser.profile_picture).toEqual("newPicture");
  });

  it("should handle setLoggedInUser", () => {
    const user = {
      id: 1,
      username: "testUser",
      token: "testToken",
      refresh_token: "testRefreshToken",
    };
    const newState = authReducer(initialState, setLoggedInUser(user));
    expect(newState.loggedInUser).toEqual(user);
    expect(newState.token).toEqual("testToken");
    expect(newState.authenticated).toEqual(true);
    expect(newState.authRefreshToken).toEqual("testRefreshToken");
  });

  it("should handle logoutUser", () => {
    const stateWithUser = {
      ...initialState,
      loggedInUser: { id: 1, username: "testUser" },
      token: "testToken",
      authenticated: true,
      authToken: "testAuthToken",
      authRefreshToken: "testRefreshToken",
      socialUsers: [
        /* some social users */
      ],
    };
    const newState = authReducer(stateWithUser, logoutUser());
    expect(newState.loggedInUser).toEqual(null);
    expect(newState.token).toEqual(null);
    expect(newState.authenticated).toEqual(false);

    expect(newState.authRefreshToken).toEqual(null);
    expect(newState.socialUsers).toEqual([]);
  });

  it("should handle setSocialUsers", () => {
    const socialUsers = [
      /* some social users */
    ];
    const newState = authReducer(initialState, setSocialUsers(socialUsers));
    expect(newState.socialUsers).toEqual(socialUsers);
  });

  it("should handle removeSocialUsers", () => {
    const stateWithSocialUsers = {
      ...initialState,
      socialUsers: [
        /* some social users */
      ],
    };
    const newState = authReducer(stateWithSocialUsers, removeSocialUsers());
    expect(newState.socialUsers).toEqual([]);
  });

  it("should handle setLogout", () => {
    // Since setLogout doesn't modify the state, there's nothing specific to test here.
    // You can consider it as a no-op action in this context.
    const newState = authReducer(initialState, setLogout());
    expect(newState).toEqual(initialState);
  });
});
