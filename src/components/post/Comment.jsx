import React, { useState, useEffect } from "react";
import LikeIcon from "../../images/like.png";
import DislikeIcon from "../../images/dislike.png";
import { addLikeToComment, addNewCommentOnComment, getAllLikesOnComm, likeCheck } from "../../api/postApi";
import "../../styles/CommentSection.css";
import defaultAvatar from "../../images/default_avatar.png";
import { allUserInform } from "../../api/userApi";
import ReplyItem from "../post/ReplyItem.jsx"

const BASE_URL = "http://localhost:3001";

const Comment = ({ comment, postId, setComments, comments }) => {
    const [likeStatus, setLikeStatus] = useState("");
    const [likes, setLikes] = useState(comment.likes || 0);
    const [dislikes, setDislikes] = useState(comment.dislikes || 0);
    const [newComment, setNewComment] = useState("");
    const [authorComment, setAuthorComment] = useState({});
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    useEffect(() => {
        getAllLikesOnComm(comment.id).then((response) => {
            setLikes(response.data.data.like);
            setDislikes(response.data.data.dislike);
        }).catch(console.error);

        likeCheck(comment.id, "comment").then((response) => {
            setLikeStatus(response.data.data.type || null);
        }).catch(console.error);

        allUserInform(comment.author_id).then((res) => {
            const authorData = res.data.data;
            setAuthorComment({
                ...authorData,
                author_avatar: authorData.author_avatar ? `${BASE_URL}${authorData.author_avatar}` : defaultAvatar,
            });
        }).catch(console.error);
    }, [comment]);

    const handleLike = () => {
        addLikeToComment(comment.id, { type_like: "like" }).then(() => {
            getAllLikesOnComm(comment.id).then((response) => {
                setLikes(response.data.data.like);
                setDislikes(response.data.data.dislike);
            }).catch(console.error);
            setLikeStatus(likeStatus === "like" ? "" : "like");
        }).catch(console.error);
    };

    const handleDislike = () => {
        addLikeToComment(comment.id, { type_like: "dislike" }).then(() => {
            getAllLikesOnComm(comment.id).then((response) => {
                setLikes(response.data.data.like);
                setDislikes(response.data.data.dislike);
            }).catch(console.error);
            setLikeStatus(likeStatus === "dislike" ? "" : "dislike");
        }).catch(console.error);
    };

    const handleAddCommentOnComment = async () => {
        const content = newComment.trim();
        if (content) {
            try {
                const response = await addNewCommentOnComment(comment.id, { content: content });
                const newCommentResponse = response.data.data; // Отримуємо новий коментар із відповіді

                // Оновлюємо список коментарів у стані
                setComments((prevComments) => {
                    return prevComments.map((c) => {
                        if (c.id === comment.id) {
                            return {
                                ...c,
                                replies: [...(c.replies || []), newCommentResponse],
                            };
                        }
                        return c;
                    });
                });

                setNewComment(""); // Очищаємо поле для введення
            } catch (error) {
                console.error("Error adding reply:", error);
            }
        }
    };


    return (
        <div className="comment-item">
            <div className="main-comm-part">
                <div className="comm-header">
                    <div className="avatar-container-comm">
                        <img
                            src={authorComment.author_avatar}
                            alt="Author avatar"
                            className="author-avatar"
                        />
                    </div>
                    <div className="avatar-login-comm">
                        <div className="login-date-row">
                            <p className="author-name">{authorComment.author_login || "Unknown Author"}</p>
                            <p className="comm-date">
                                Published: {new Date(comment.publish_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="comm-content">
                            <p>{comment.content}</p>
                        </div>
                    </div>
                </div>

                <div className="comment-actions">
                    <button onClick={() => setShowReplyBox(!showReplyBox)} style={{ color: "yellow" }}>
                        Reply
                    </button>
                    <div className="comm-likes">
                        <button className="like-button" onClick={handleLike}>
                            <img
                                src={LikeIcon}
                                alt="like"
                                className={`like-icon ${likeStatus === "like" ? "selected" : ""}`}
                            />
                            <span style={{ color: "yellow" }}>{likes}</span>
                        </button>
                        <button className="like-button" onClick={handleDislike}>
                            <img
                                src={DislikeIcon}
                                alt="dislike"
                                className={`dislike-icon ${likeStatus === "dislike" ? "selected" : ""}`}
                            />
                            <span style={{ color: "yellow" }}>{dislikes}</span>
                        </button>
                    </div>
                </div>
            </div>

            {comment.replies?.length > 0 && (
                <button
                    className="view-replies-button"
                    onClick={() => setShowReplies(!showReplies)}
                >
                    {showReplies
                        ? `Hide replies (${comment.replies.length})`
                        : `View replies (${comment.replies.length})`}
                </button>
            )}

            {showReplies && (
                <ul className="replies-list">
                    {comment.replies.map((reply) => (
                        <li key={reply.id} className="reply-item">
                            <ReplyItem reply={{
                                id: reply.id,
                                content: reply.content,
                                author_id: reply.author_id,
                                publish_date: reply.publish_date
                            }} />
                        </li>
                    ))}
                </ul>
            )}

            {showReplyBox && (
                <div className="add-comment">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <button onClick={handleAddCommentOnComment}>Add Reply</button>
                </div>
            )}
        </div>
    );
};

export default Comment;
