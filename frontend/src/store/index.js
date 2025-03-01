import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice'; // Adjust the path based on your folder structure

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});
