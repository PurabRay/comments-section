import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addComment, addReply } from '../commentsSlice';
import Comment from './Comment';

const CommentsList = () => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const comments = useSelector(state => state.comments);
  const dispatch = useDispatch();

  const handleAddComment = () => {
    const finalName = name.trim() || 'Anonymous';
    if (text.trim()) {
      dispatch(addComment({
        id: Date.now(),
        name: finalName,
        text: text.trim(),
        date: new Date().toISOString(),
        replies: [],
      }));
      setName('');
      setText('');
    }
  };

  const handleAddReply = (parentId, replyText, replyName) => {
    dispatch(addReply({
      parentId,
      reply: {
        id: Date.now(),
        name: replyName.trim() || 'Anonymous',
        text: replyText.trim(),
        date: new Date().toISOString(),
        replies: [],
      },
    }));
  };

  const sortedComments = useMemo(() => {
    const flattenAndSort = (commentsArray) => {
      let flattened = [];
      for (let comment of commentsArray) {
        flattened.push(comment);
        if (comment.replies && comment.replies.length > 0) {
          flattened = flattened.concat(flattenAndSort(comment.replies));
        }
      }
      return flattened.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
    };
    return flattenAndSort(comments);
  }, [comments, sortOrder]);

  return (
    <div>
      <h2>Comments</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
      />
      <button onClick={handleAddComment}>Post Comment</button>

      <div>
        <label htmlFor="sort-order">Sort by: </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Date time: newest</option>
          <option value="oldest">Date time: oldest</option>
        </select>
      </div>

      <div className="comments">
        {sortedComments.map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment} 
            onAddReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;