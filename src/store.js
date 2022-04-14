import { configureStore } from '@reduxjs/toolkit';
import userReducer from './stateManager/user/userSlice';


export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
