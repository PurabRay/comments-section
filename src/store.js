import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from './commentsSlice';

export default configureStore({
  reducer: {
    comments: commentsReducer,
  },
});
