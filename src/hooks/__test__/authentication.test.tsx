import { renderHook, act } from "@testing-library/react-hooks";
import useAuthentication from "./../isUserAuthenticated";
import { Provider } from "react-redux";
import { store } from "src/store";
import { setLoggedInUser } from "src/store/slices/authSlice";
const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
describe("isUserAuthenticated shoud be executed correctly", () => {
  test(`Default value of useAuthentication will be 123456789`, () => {
    const { result } = renderHook(() => useAuthentication(), { wrapper });
    act(() => {
      let payload = {
        id: 123456789,
      };
      store.dispatch(setLoggedInUser(payload));
    });
    expect(result.current.isUserAuthenticated).toBe(true);
    expect(result.current.userID).toBe(123456789);
  });
});
