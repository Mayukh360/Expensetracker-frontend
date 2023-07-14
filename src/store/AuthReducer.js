import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { isAuthenticated: false, isPremium: false, darkToggle:false };

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    islogin(state, action) {
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload);
    },
    islogout(state) {
      state.isAuthenticated = false;
      state.isPremium = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("isPremium");
    },
    ispremium(state, action) {
      console.log("This is from redux", action.payload)
      if (action.payload == true ) {
        state.isPremium = true;
      } else {
        state.isPremium = false;
      }
    },
    isToggle(state){
    state.darkToggle=!state.darkToggle;
    },
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
// export default authSlice;
