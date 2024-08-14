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
const deleteCommentById = (comments, id) => {
  return comments.reduce((acc, comment) => {
    if (comment.id === id) {
      return acc; 
    }
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = deleteCommentById(comment.replies, id);
      if (updatedReplies.length !== comment.replies.length) {
       return [...acc, { ...comment, replies: updatedReplies }];
      }
    }
    return [...acc, comment];
  }, []);
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
      const { commentId, reply } = action.payload;
      const newState = state.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply],
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: addReplyToNestedComments(comment.replies, commentId, reply),
          };
        }
        return comment;
      });
      saveState(newState);
      return newState;
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

const addReplyToNestedComments = (replies, commentId, reply) => {
  return replies.map(replyComment => {
    if (replyComment.id === commentId) {
      return {
        ...replyComment,
        replies: [...(replyComment.replies || []), reply],
      };
    } else if (replyComment.replies) {
      return {
        ...replyComment,
        replies: addReplyToNestedComments(replyComment.replies, commentId, reply),
      };
    }
    return replyComment;
  });
};

export const { addComment, editComment, deleteComment, addReply } = commentsSlice.actions;
export default commentsSlice.reducer;
