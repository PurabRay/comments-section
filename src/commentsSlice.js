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
      const comment = findCommentById(state, id);
      if (comment) {
        comment.text = text;
        saveState(state);
      }
    },
    deleteComment: (state, action) => {
      const newState = deleteCommentById(state, action.payload);
      saveState(newState);
      return newState;
    },
    addReply: (state, action) => {
      const { parentId, reply } = action.payload;
      const comment = findCommentById(state, parentId);
      if (comment) {
        if (!comment.replies) comment.replies = [];
        comment.replies.push(reply);
        saveState(state);
      }
    },
  },
});


const findCommentById = (comments, id) => {
  for (let comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to delete a comment by ID (including nested replies)
const deleteCommentById = (comments, id) => {
  return comments.filter(comment => {
    if (comment.id === id) return false;
    if (comment.replies) {
      comment.replies = deleteCommentById(comment.replies, id);
    }
    return true;
  });
};

export const { addComment, editComment, deleteComment, addReply } = commentsSlice.actions;
export default commentsSlice.reducer;