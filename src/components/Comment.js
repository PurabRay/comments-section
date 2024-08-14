import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editComment, deleteComment, addReply } from '../commentsSlice';

const Comment = ({ comment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(comment.text);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState(''); // State for reply name
  const dispatch = useDispatch();

  const handleEdit = () => {
    dispatch(editComment({ id: comment.id, text: newText }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment.id));
  };

  const handleReply = () => {
    const finalReplyName = replyName.trim() ? replyName : 'Anonymous';  // Default to 'Anonymous' if reply name is empty
    if (replyText.trim()) {
      dispatch(addReply({
        commentId: comment.id,
        reply: {
          id: Date.now(),
          name: finalReplyName,
          text: replyText,
          date: new Date().toLocaleString(),
        }
      }));
      setReplyText('');
      setReplyName('');  // Clear the reply name field after submission
    }
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <strong>{comment.name}</strong> <span>{comment.date}</span>
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
      {isEditing ? (
        <div>
          <textarea value={newText} onChange={(e) => setNewText(e.target.value)} />
          <button onClick={handleEdit}>Save</button>
        </div>
      ) : (
        <p>{comment.text}</p>
      )}
      <div className="replies">
        {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
          <Comment key={reply.id} comment={reply} />
        ))}
      </div>
      <input
        type="text"
        value={replyName}
        onChange={(e) => setReplyName(e.target.value)}
        placeholder="Your name"
      />
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write a reply..."
      />
      <button onClick={handleReply}>Reply</button>
    </div>
  );
};

export default Comment;

