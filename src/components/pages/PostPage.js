import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    getPostById,
    getAllCommentsForPost,
    addNewPostComment,
    getAllPhotosForPost,
    getAllLikesOnPost,
    addLikeToPost,
    likeCheck
} from "../../api/postApi";
import "../../styles/PostPage.css";
import CommentSection from "../post/CommentSection.jsx";
import HeaderItem from "../../components/Header/headerItem";
import LikeIcon from "../../images/like.png"
import DislikeIcon from "../../images/dislike.png"
import { addToFavorite, deleteFavoritePost, favoriteCheck } from "../../api/userApi";
import FavoriteIcon from "../../images/favorites.png"
import { toast } from 'react-toastify';

const PostPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [photos, setPhotos] = useState([]);
    const [fullscreenPhoto, setFullscreenPhoto] = useState(null); // Активне фото
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Індекс активного фото
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [likeStatus, setLikeStatus] = useState(null);
    const [favoriteStatus, setFavoriteStatus] = useState(null);
    const [favoriteID, setfavoriteID] = useState(null);

    useEffect(() => {
        getPostById(postId)
            .then((res) => setPost(res.data.data))
            .catch(console.error);

        getAllCommentsForPost(postId)
            .then((res) => setComments(res.data.data))
            .catch(console.error);

        getAllPhotosForPost(postId)
            .then((res) => setPhotos(res.data.data))
            .catch(console.error);

        getAllLikesOnPost(postId)
            .then((res) => {
                setLikes(res.data.data.like)
                setDislikes(res.data.data.dislike)
            })
            .catch(console.error);
        likeCheck(postId, "post").then(response => {
            console.log("likeCheck", response.data.data.type)
            if (response.data.data.type) {
                setLikeStatus(response.data.data.type); // Зберігаємо тип: 'like' або 'dislike'
            } else {
                setLikeStatus(null); // Якщо немає реакції
            }
        }).catch(console.error)

        favoriteCheck(postId).then(response => {
            console.log("favoriteCheck response.data.success", response.data)
            if (response.data.success === true) {
                console.log("favoriteCheck response.data.data", response.data.data)
                setfavoriteID(response.data.data.id);
                setFavoriteStatus(true);
            } else {
                setFavoriteStatus(false);
            }
        }).catch(console.error)
    }, [postId]);

    const handleFavorite = () => {
        if (favoriteStatus === false) {
            addToFavorite(postId)
                .then((res) => {
                    favoriteCheck(postId).then(response => {
                        setfavoriteID(response.data.data.id)
                    }).catch(console.error)
                    setFavoriteStatus(true);
                    toast.success(res.data.message);
                })
                .catch(console.error);
        }
        else {
            deleteFavoritePost(favoriteID)
                .then((res) => {
                    setfavoriteID(null)
                    setFavoriteStatus(false);
                    toast.success(res.data.message);
                })
                .catch(console.error);
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        addNewPostComment(postId, { content: newComment })
            .then((res) => {
                setComments((prevComments) => [...prevComments, res.data.data]);
                setNewComment("");
            })
            .catch(console.error);
    };

    const openFullscreenPhoto = (index) => {
        setFullscreenPhoto(photos[index]);
        setCurrentPhotoIndex(index);
    };

    const closeFullscreenPhoto = () => {
        setFullscreenPhoto(null);
    };

    const showNextPhoto = () => {
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex((prevIndex) => prevIndex + 1);
            setFullscreenPhoto(photos[currentPhotoIndex + 1]);
        }
    };

    const showPrevPhoto = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex((prevIndex) => prevIndex - 1);
            setFullscreenPhoto(photos[currentPhotoIndex - 1]);
        }
    };

    const handleLike = () => {
        addLikeToPost(post.id, { type_like: "like" })
            .then((res) => {
                setLikeStatus("like");
                getAllLikesOnPost(post.id)
                    .then((res) => {
                        setLikes(res.data.data.like)
                        setDislikes(res.data.data.dislike)
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    };

    const handleDislike = () => {
        addLikeToPost(post.id, { type_like: "dislike" })
            .then((res) => {
                setLikeStatus("dislike");
                getAllLikesOnPost(post.id)
                    .then((res) => {
                        setLikes(res.data.data.like)
                        setDislikes(res.data.data.dislike)
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    };

    return (
        <div className="post-page">
            <HeaderItem />
            {post && (
                <div className="post-details">
                    <h1>{post.title}</h1>
                    <p className="post-content">{post.content}</p>
                    <div className="post-photos">
                        {photos.map((photo, index) => (
                            <img
                                key={photo.id}
                                src={`http://localhost:3001${photo.image_path}`}
                                alt="Post"
                                className="post-photo"
                                onClick={() => openFullscreenPhoto(index)}
                            />
                        ))}
                    </div>
                    <div className="LikesOnPost">
                        <button
                            className={`like-button`}
                            onClick={handleLike}
                        >
                            <img
                                src={LikeIcon}
                                alt="like icon"
                                className={`like-icon ${likeStatus === "like" ? "selected" : ""}`}
                            />
                            <span>{likes}</span>
                        </button>
                        <button
                            className={`dislike-button`}
                            onClick={handleDislike}
                        >
                            <img
                                src={DislikeIcon}
                                alt="dislike icon"
                                className={`dislike-icon ${likeStatus === "dislike" ? "selected" : ""}`}
                            />
                            <span>{dislikes}</span>
                        </button>
                        <button
                            className={`favorite-button`}
                            onClick={handleFavorite}
                        >
                            <img
                                src={FavoriteIcon}
                                alt="favorite icon"
                                className={`favorite-icon ${favoriteStatus === true ? "selected" : ""}`}
                            />
                        </button>
                    </div>
                </div>
            )}

            <CommentSection
                comments={comments}
                newComment={newComment}
                postId={postId}
                setNewComment={setNewComment}
                setComments={setComments}
                handleAddComment={handleAddComment}
            />

            {fullscreenPhoto && (
                <div className="fullscreen-photo-container">
                    <button className="close-btn" onClick={closeFullscreenPhoto}>
                        ×
                    </button>
                    <button className="prev-btn" onClick={showPrevPhoto} disabled={currentPhotoIndex === 0}>
                        ‹
                    </button>
                    <img
                        src={`http://localhost:3001${fullscreenPhoto.image_path}`}
                        alt="Fullscreen"
                        className="fullscreen-photo"
                    />
                    <button
                        className="next-btn"
                        onClick={showNextPhoto}
                        disabled={currentPhotoIndex === photos.length - 1}
                    >
                        ›
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostPage;
