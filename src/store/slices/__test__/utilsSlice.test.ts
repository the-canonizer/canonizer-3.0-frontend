import utilsReducer, {
  setValue,
  setScoreCheckBox,
  setReasonData,
  setArchivedCheckBox,
} from "../utilsSlice"; // Replace with the path to your slice file

describe("utilsSlice", () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      logout_type: false,
      email_id: "",
      remember_me: null,
      social_login_keys: null,
      redirect_type: false,
      redirect_tab_setting: "",
      score_checkbox: false,
      archived_checkbox: false,
      reasonData: {},
    };
  });

  it("should handle setValue", () => {
    const payload = { label: "email_id", value: "test@example.com" };
    const newState = utilsReducer(initialState, setValue(payload));
    expect(newState.email_id).toBe(payload.value);
  });

  it("should handle setScoreCheckBox", () => {
    const newState = utilsReducer(initialState, setScoreCheckBox(true));
    expect(newState.score_checkbox).toBe(true);
  });

  it("should handle setReasonData", () => {
    const payload = { reason1: "Reason 1", reason2: "Reason 2" };
    const newState = utilsReducer(initialState, setReasonData(payload));
    expect(newState.reasonData).toEqual(payload);
  });

  it("should handle setArchivedCheckBox", () => {
    const newState = utilsReducer(initialState, setArchivedCheckBox(true));
    expect(newState.archived_checkbox).toBe(true);
  });

  // Add more test cases as needed...
});
