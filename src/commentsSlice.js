import { createSlice } from '@reduxjs/toolkit';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('comments');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (err) {
    return [];
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('comments', serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState: loadState(),
  reducers: {
    addComment: (state, action) => {
      state.push(action.payload);
      saveState(state);
    },
    editComment: (state, action) => {
      const { id, text } = action.payload;
      const comment = state.find(comment => comment.id === id);
      if (comment) {
        comment.text = text;
        saveState(state);
      }
    },
    deleteComment: (state, action) => {
      const newState = state.filter(comment => comment.id !== action.payload);
      saveState(newState);
      return newState;
    },
    addReply: (state, action) => {
      const { commentId, reply } = action.payload;
      const comment = state.find(comment => comment.id === commentId);
      if (comment) {
        comment.replies.push(reply);
        saveState(state);
      }
    },
  },
});

export const { addComment, editComment, deleteComment, addReply } = commentsSlice.actions;
export default commentsSlice.reducer;
