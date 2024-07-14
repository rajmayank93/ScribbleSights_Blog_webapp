import React, { useState, useEffect, useCallback } from 'react';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
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


  // Function to fetch comments based on postId
  const fetchComments = useCallback(async () => {
    try {
      console.log("Fetching comments for postId:", postId);
      const response = await fetch(`http://localhost:4000/comments/${postId}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      console.log('Fetched comments:', data);
      setComments(data); // Update comments state
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchComments();
  }, [fetchComments]); // Depend only on fetchComments function

 



  return (
    
    <><form onSubmit={handleSubmit}>
    <textarea cols={125} value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
    <button type="submit">Add Comment</button>
  </form>
    
    <div className="comments-container">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div className="comment" key={comment._id}>
          <p>{comment.content}</p>
          <small>by {comment.author.username}</small>
        </div>
      ))}
      {/* Example of adding a new comment */}
      {/* <button onClick={() => addComment("New comment")}>Add Comment</button> */}
    </div></>
  );
};

export default Comments;
