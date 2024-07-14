import React, { useState } from 'react';

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ postId, content })
      });
      const data = await response.json();
      console.log(data);
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea cols={125} value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
      <button type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;
