import React, { useState, useEffect } from "react";
import Comment from "../post/Comment.jsx";
import { addNewPostComment } from "../../api/postApi";

const CommentSection = ({ postId, comments, setComments }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (content) {
      addNewPostComment(postId, { content: content }).then(response => {
        const newPostComment = response.data.data;
        setComments([...comments, newPostComment]);
        setNewComment("");
      }).catch(console.error);
    }
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <Comment
              comment={comment}
              postId={postId}
              comments={comments}
              setComments={setComments}
            />
          </li>
        ))}
      </ul>

      <div className="add-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default CommentSection;
