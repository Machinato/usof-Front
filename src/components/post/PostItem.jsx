import React, { useEffect, useState } from "react";
import { getAllCategoriesForPost, getAllLikesOnPost, addLikeToPost, getAllPhotosForPost, likeCheck } from "../../api/postApi";
import { allUserInform, userRating, addToFavorite, deleteFavoritePost, favoriteCheck } from "../../api/userApi";
import defaultAvatar from "../../images/default_avatar.png";
import CategoryItem from '../post/CategoriesItem';
import "../../styles/PostItem.css"
import closeImg from "../../images/close.png"
import LikeIcon from "../../images/like.png"
import DislikeIcon from "../../images/dislike.png"
import FavoriteIcon from "../../images/favorites.png"
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import ImageModal from './ImageModal';


const BASE_URL = "http://localhost:3001";

const PostItem = ({ post }) => {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [authorPost, setAuthor] = useState({});
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [likeStatus, setLikeStatus] = useState(null);
    const [favoriteStatus, setFavoriteStatus] = useState(null);
    const [favoriteID, setfavoriteID] = useState(null);

    const previewContent = post.content.length > 171 ? `${post.content.slice(0, 171)}...` : post.content;

    useEffect(() => {
        // Отримуємо інформацію про автора
        allUserInform(post.author_id)
            .then((res) => {
                const authorData = res.data.data;
                setAuthor({
                    ...authorData,
                    author_avatar: authorData.author_avatar ? `${BASE_URL}${authorData.author_avatar}` : defaultAvatar,
                });
            })
            .catch(console.error);

        // Отримуємо категорії
        getAllCategoriesForPost(post.id)
            .then((res) => setCategories(res.data.data))
            .catch(console.error);

        // Отримуємо кількість лайків
        getAllLikesOnPost(post.id)
            .then((res) => {
                setLikes(res.data.data.like)
                setDislikes(res.data.data.dislike)
            })
            .catch(console.error);

        getAllPhotosForPost(post.id).then(response => {
            console.log("getAllPhotosForPost", response.data.data)
            setPhotos(response.data.data);
        }).catch(console.error);

        likeCheck(post.id, "post").then(response => {
            console.log("likeCheck", response.data.data.type)
            if (response.data.data.type) {
                setLikeStatus(response.data.data.type);
            } else {
                setLikeStatus(null);
            }
        }).catch(console.error)

        favoriteCheck(post.id).then(response => {
            console.log("favoriteCheck response.data.success", response.data)
            if (response.data.success === true) {
                setfavoriteID(response.data.data.id);
                setFavoriteStatus(true);
            } else {
                setFavoriteStatus(false);
            }
        }).catch(console.error)
    }, [post.id, post.author_id]);

    const handleFavorite = () => {
        if (favoriteStatus === false) {
            addToFavorite(post.id)
                .then((res) => {
                    favoriteCheck(post.id).then(response => {
                        setfavoriteID(response.data.data.id)
                    }).catch(console.error)
                    setFavoriteStatus(true);
                    toast.success(res.data.message);
                })
                .catch(console.error);
        }
        else {
            deleteFavoritePost(favoriteID)
                .then((response) => {
                    setfavoriteID(response.data.data.id)
                    setFavoriteStatus(false);
                    toast.success(response.data.message);
                })
                .catch(console.error);
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
                userRating(post.author_id).then((res) => {
                    setAuthor({ ...authorPost, author_rating: res.data.data.rating })
                }).catch();
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
                userRating(post.author_id).then((res) => {
                    setAuthor({ ...authorPost, author_rating: res.data.data.rating })
                }).catch();
            })
            .catch(console.error);
    };

    const getHeaderStyle = () => {
        const rating = authorPost.author_rating || 0;

        if (rating > 10) {
            // Високий рейтинг: додаємо сяйво
            return {
                boxShadow: "0 0 15px 5px rgba(255, 215, 0, 0.7)", // Золотисте сяйво
                animation: "glow 3s infinite ease-in-out", // Анімація пульсації
            };
        } else if (rating > 5) {
            // Середній рейтинг: легке сяйво
            return {
                boxShadow: "0 0 10px 3px rgba(135, 206, 235, 0.5)", // Блакитне сяйво
            };
        } else {
            // Низький рейтинг: без ефектів
            return {
                boxShadow: "none",
            };
        }
    };

    // const handleHover = () => {
    //     const container = document.querySelector(`#post-${post.id}`);
    //     for (let i = 0; i < 20; i++) {
    //         const particle = document.createElement("div");
    //         particle.className = "particle";
    //         particle.style.left = `${Math.random() * 100}%`;
    //         particle.style.top = `${Math.random() * 100}%`;
    //         container.appendChild(particle);

    //         setTimeout(() => {
    //             particle.remove();
    //         }, 1000); // Видаляємо частинки після анімації
    //     }
    // };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(`${BASE_URL}${photo.image_path}`);
    };
    const openImageModal = (photo) => {
        setSelectedPhoto(`${BASE_URL}${photo.image_path}`);
    };

    const handleCloseFullscreen = () => {
        setSelectedPhoto(null);
    };
    const closeImageModal = () => {
        setSelectedPhoto(null);
    };

    const handleNavigateToPost = () => {
        navigate(`/posts/${post.id}`);
    };

    return (
        <div id={`post-${post.id}`}
            className="post-preview"
            // onMouseEnter={handleHover}
            style={getHeaderStyle()}
        >
            {/* {selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <img src={selectedImage} alt="Full Screen" />
                </div>
            )} */}
            <ImageModal imageSrc={selectedPhoto} onClose={closeImageModal} />

            {/* {selectedPhoto && (
                <div className="fullscreen-overlay">
                    <img src={selectedPhoto} alt="Full-size" className="fullscreen-image" />
                    <button className="button-close-img" onClick={handleCloseFullscreen}>
                        <img
                            src={closeImg}
                            alt="close icon"
                            className="close-icon" />
                    </button>
                </div>
            )} */}
            <div onClick={handleNavigateToPost} className="post-header">
                <div className="avatar-container">
                    <img
                        src={authorPost.author_avatar}
                        alt="Author avatar"
                        className="author-avatar"
                    />
                </div>
                <div>
                    <p className="author-name">{authorPost.author_login || "Unknown Author"}</p>
                    <p className="author-name">{authorPost.author_rating}</p>
                    <p className="post-date">
                        Published: {new Date(post.publish_date).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{previewContent}</p>

            <div className="post-mini-photos">
                {photos.slice(0, 10).map((photo) => (
                    <div className="mini-img-container" key={photo.id}>
                        <img
                            src={`${BASE_URL}${photo.image_path}`}
                            alt="Mini image"
                            className="mini-img"
                            onClick={() => openImageModal(photo)}
                        />
                    </div>
                ))}
                {photos.length > 10 && (
                    <div className="mini-img-container more-photos">
                        +{photos.length - 10}
                    </div>
                )}
            </div>


            <div className="likes-and_Categories">
                {categories.length > 0 && (

                    <p className="post-categories">
                        {categories.map((category) =>
                            <CategoryItem key={category.id} category={category} />
                        )}
                    </p>

                )}
                <div className="LikesOnPost">
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
                </div>
            </div>

            {/* <p className="post-likes">Likes: {likes} </p> */}
        </div>
    );
};

export default PostItem;



