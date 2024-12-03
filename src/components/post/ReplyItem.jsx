import React, { useState, useEffect } from "react";
import LikeIcon from "../../images/like.png";
import DislikeIcon from "../../images/dislike.png";
import defaultAvatar from "../../images/default_avatar.png";
import { addLikeToComment, getAllLikesOnComm, likeCheck } from "../../api/postApi";
import { allUserInform } from "../../api/userApi";
import "../../styles/ReplyItem.css"

const BASE_URL = "http://localhost:3001";

const ReplyItem = ({ reply }) => {
    const [authorInfo, setAuthorInfo] = useState({});
    const [likes, setLikes] = useState(reply.likes || 0);
    const [dislikes, setDislikes] = useState(reply.dislikes || 0);
    const [likeStatus, setLikeStatus] = useState("");

    useEffect(() => {
        // Завантаження інформації про автора
        allUserInform(reply.author_id)
            .then((res) => {
                const authorData = res.data.data;
                setAuthorInfo({
                    ...authorData,
                    author_avatar: authorData.author_avatar ? `${BASE_URL}${authorData.author_avatar}` : defaultAvatar,
                });
            })
            .catch(console.error);

        // Завантаження лайків та дизлайків
        getAllLikesOnComm(reply.id)
            .then((response) => {
                setLikes(response.data.data.like);
                setDislikes(response.data.data.dislike);
            })
            .catch(console.error);

        // Перевірка статусу лайка
        likeCheck(reply.id, "comment")
            .then((response) => {
                setLikeStatus(response.data.data.type || null);
            })
            .catch(console.error);
    }, [reply]);

    const handleLike = () => {
        addLikeToComment(reply.id, { type_like: "like" })
            .then(() => {
                getAllLikesOnComm(reply.id).then((response) => {
                    setLikes(response.data.data.like);
                    setDislikes(response.data.data.dislike);
                });
                setLikeStatus(likeStatus === "like" ? "" : "like");
            })
            .catch(console.error);
    };

    const handleDislike = () => {
        addLikeToComment(reply.id, { type_like: "dislike" })
            .then(() => {
                getAllLikesOnComm(reply.id).then((response) => {
                    setLikes(response.data.data.like);
                    setDislikes(response.data.data.dislike);
                });
                setLikeStatus(likeStatus === "dislike" ? "" : "dislike");
            })
            .catch(console.error);
    };

    return (
        <div>
            <div className="reply-header">
                <div className="avatar-container-reply">
                    <img
                        src={authorInfo.author_avatar}
                        alt="Author avatar"
                        className="author-avatar"
                    />
                </div>
                <div className="reply-info">
                    <p className="author-name">{authorInfo.author_login || "Unknown Author"}</p>
                    <p className="reply-date">
                        Published: {new Date(reply.publish_date).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="reply-content">
                <p>{reply.content}</p>
            </div>

            <div className="reply-actions">
                <button onClick={handleLike}>
                    <img
                        src={LikeIcon}
                        alt="like"
                        className={`like-icon ${likeStatus === "like" ? "selected" : ""}`}
                    />
                    <span>{likes}</span>
                </button>
                <button onClick={handleDislike}>
                    <img
                        src={DislikeIcon}
                        alt="dislike"
                        className={`dislike-icon ${likeStatus === "dislike" ? "selected" : ""}`}
                    />
                    <span>{dislikes}</span>
                </button>
            </div>
        </div>
    );
};

export default ReplyItem;
