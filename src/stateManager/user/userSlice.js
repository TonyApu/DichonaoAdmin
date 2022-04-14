
const { createSlice, current } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("dichonao_admin")),
  reducers: {
    setUser(state, action) {
      localStorage.setItem(
        "dichonao_admin",
        JSON.stringify({ ...action.payload.user })
      );
      localStorage.setItem("dichonao_admin_token", action.payload.token);
      return action.payload.user;
    },
    logout() {
      localStorage.removeItem("dichonao_admin");
      localStorage.removeItem("dichonao_admin_token");
      return null;
    },
    //   updateUser(state, action) {
    //     let currentState = current(state);
    //     localStorage.setItem(
    //       "dichonao_user",
    //       JSON.stringify({...currentState, ...action.payload})
    //     );
    //     return {...currentState, ...action.payload};
    //   }
  },
});

const { actions, reducer } = userSlice;
export const { setUser, logout } = actions;
export default reducer;
