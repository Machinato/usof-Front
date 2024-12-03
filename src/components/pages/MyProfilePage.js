import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/MyProfilePage.css";
import HeaderItem from "../../components/Header/headerItem";
import { getOwnPosts, getPostById, updateStatusPost, updatePost, removePost } from "../../api/postApi.js";
import { getAllOwnCommets, updateComment, deleteComment, updateStatusComment } from "../../api/commentApi.js";
import PostItem from "../post/PostItem";
import { getAllFavorite, ownUserRating} from "../../api/userApi.js";
import deleteIcon from "../../images/delete.png"
import editIcon from "../../images/edit.png"
import inactiveIcon from "../../images/inactive.png"
import Comment from "../post/Comment.jsx"
import { toast } from "react-toastify";
import ConfirmationModal from "../post/ConfirmationModal.jsx"
import EditModal from "../post/EditModal.js"

const MyProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showPosts, setShowPosts] = useState(false);
    const [showComments, setshowComments] = useState(false);
    const [showFavorites, setshowFavorites] = useState(false);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [userComments, setuserComments] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(() => null);
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const posts = useSelector((state) => state.posts);
    const user = useSelector((state) => state.auth.user);
    const isAuth = useSelector((state) => state.auth.isAuth);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEdit, setisEdit] = useState("");
    const [editData, setEditData] = useState(null);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        getOwnPosts()
            .then((response) => {
                dispatch({ type: "SET_POSTS", payload: response.data.data });
            })
            .catch((error) => console.error("Error fetching posts:", error));

        getAllFavorite().then((response) => {
            console.log("getAllFavorite", response.data.data);
            response.data.data.forEach(element => {
                getPostById(element.post_id).then(postResponse => {
                    setFavoritePosts((prevFavorites) => [
                        ...prevFavorites,
                        postResponse.data,
                    ]);
                }).catch((error) => console.error("Error getPostById:", error));
            });
        }).catch((error) => console.error("Error getAllFavorite posts:", error));

        getAllOwnCommets().then((response) => {
            console.log("getAllOwnCommets", response.data.data);
            setuserComments(response.data.data)
        }).catch((error) => console.error("Error getAllOwnCommets cooments:", error))

        console.log("favoritePosts", favoritePosts)
        ownUserRating().then(response => {
            console.log("ownUserRating", response.data.data)
            setUserRating(response.data.data.rating)
        }).catch(console.error)
    }, [dispatch]);

    console.log("Стан Redux (posts):", posts);

    useEffect(() => {
        console.log("favoritePosts змінилось:", favoritePosts);
    }, [favoritePosts]);

    // useEffect(() => {
    //     console.log("showPosts", showPosts);
    // }, [showPosts]);

    const openConfirmation = (action, message) => {
        setActionToConfirm(() => action);
        setConfirmationMessage(message);
        setIsConfirmationOpen(true);
    };

    const handleConfirmAction = () => {
        actionToConfirm();
        setIsConfirmationOpen(false);
    };

    const openEditModal = (data, type) => {
        setisEdit(type)
        console.log("openEditModal", data)
        setEditData(data);
        console.log("editData", editData)
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedData) => {
        // Викликати API для збереження змін
        updatePost(updatedData.id, updatedData).then(() => {
            toast.success("Пост оновлено");
            // Оновити стани чи дані
        }).catch((error) => {
            toast.error("Помилка оновлення посту");
            console.error("Error updating post:", error);
        });
    };

    if (!isAuth) {
        navigate("/login"); // Якщо користувач не авторизований, перенаправляємо на сторінку входу
        return null;
    }

    const handleProfileSettings = () => {
        navigate("/profile/settings"); // Перехід до сторінки налаштувань профілю
    };

    const toggleFavoriteVisibility = () => {
        setShowPosts(false);
        setshowComments(false);
        setshowFavorites((prevState) => {
            console.log("Стан setshowFavorites змінено на:", !prevState);
            return !prevState;
        });
    };

    const togglePostsVisibility = () => {
        setshowFavorites(false);
        setshowComments(false);
        setShowPosts((prevState) => {
            console.log("Стан showPosts змінено на:", !prevState);
            return !prevState;
        });
    };

    const toggleCommentsVisibility = () => {
        setshowFavorites(false);
        setShowPosts(false);
        setshowComments((prevState) => {
            console.log("Стан showPosts змінено на:", !prevState);
            return !prevState;
        });
    };

    const handleDeletePost = (postId) => {
        removePost(postId).then(response => {
            response.data.success ? toast.success(response.data.message) : toast.error(response.data.message)
        }).catch((error) => console.error("Error handleDeletePost:", error))
    }

    const handleHidePost = (PostID) => {
        updateStatusPost(PostID).then(response => {
            response.data.success ? toast.success(response.data.message) : toast.error(response.data.message)
        }).catch((error) => console.error("Error handleHideComm:", error))
    }

    const handleEditPost = () => {

    }

    const handleDeleteComm = (commId) => {
        deleteComment(commId).then(response => {
            response.data.success === true ? toast.success(response.data.message) : toast.error(response.data.message)
        }).catch((error) => console.error("Error handleDeletePost:", error))
    }

    const handleHideComm = (commId) => {
        updateStatusComment(commId).then(response => {
            console.log("response.data.success", response.data.success)
            response.data.success === true ? toast.success(response.data.message) : toast.error(response.data.message)
        }).catch((error) => console.error("Error handleHideComm:", error))
    }

    const handleEditComm = () => {

    }

    return (
        <div className="profile-page">
            <HeaderItem />
            <div className="profile-header">
                <div className="avatar-profile-info">
                    <div className="my-pofile-avatar">
                        <img
                            src={user.profile_picture}
                            alt="Avatar"
                            className="my-pofile-avatar-img"
                        />
                    </div>
                    <div className="profile-info">
                        <h2>{user.login}</h2>
                        <h2>{user.full_name}</h2>
                        <p>{user.email_address}</p>
                        <p>Rating: {userRating}</p> {/* Замініть на динамічний рейтинг */}
                    </div>
                </div>
            </div>

            <div className="profile-actions">
                <button
                    className="profile-settings-btn"
                    onClick={handleProfileSettings}
                >
                    Profile settings
                </button>
                <button
                    className="favorites-btn"
                    onClick={toggleFavoriteVisibility}
                >
                    Favorite posts
                </button>
                <button className="profile-posts-btn" onClick={togglePostsVisibility}>
                    My posts
                </button>
                <button className="profile-posts-btn" onClick={toggleCommentsVisibility}>
                    My comments
                </button>
            </div>

            <div className="user-posts">
                {showPosts && posts.posts.length > 0 && ( // Відображаємо пости лише якщо `showPosts` === true
                    <div className={`own-posts ${!showPosts ? "hidden" : ""}`}>
                        {posts.posts.map((post) => (
                            <div key={post.id} className="post-container">
                                <div className="post-menu">
                                    <button
                                        className="menu-btn delete-btn"
                                        onClick={() => openConfirmation(() => handleDeletePost(post.id), "Ви впевнені, що хочете видалити пост?")}
                                    >
                                        <img
                                            src={deleteIcon}
                                            alt="delete icon"
                                            className="menu-img"
                                        />
                                    </button>
                                    <button
                                        className="menu-btn hide-btn"
                                        onClick={() => handleHidePost(post.id)}
                                    >
                                        <img
                                            src={inactiveIcon}
                                            alt="inactive icon"
                                            className="menu-img"
                                        />
                                    </button>
                                    <button
                                        className="menu-btn edit-btn"
                                        onClick={() => openEditModal(post, "post")}
                                    >
                                        <img
                                            src={editIcon}
                                            alt="edit icon"
                                            className="menu-img"
                                        />
                                    </button>
                                </div>

                                <PostItem key={post.id} post={post} />
                            </div>
                        ))}
                    </div>
                )}
                {showPosts && posts.posts.length === 0 && ( // Повідомлення, якщо постів немає
                    <p>У вас ще немає постів.</p>
                )}
            </div>

            <div className="user-posts">
                {showFavorites && favoritePosts.length > 0 && ( // Відображаємо пости лише якщо `showPosts` === true
                    <div className={`favorite-posts ${!showFavorites ? "hidden" : ""}`}>
                        {favoritePosts.map((post) => (
                            <PostItem key={post.data.id} post={post.data} />
                        ))}
                    </div>
                )}
                {showPosts && posts.posts.length === 0 && ( // Повідомлення, якщо постів немає
                    <p>У вас ще немає постів.</p>
                )}
            </div>

            <div className="user-comments">
                {showComments && userComments.length > 0 && (
                    <div className={`own-comments ${!showComments ? "hidden" : ""}`}>
                        {userComments.map((comm) => (
                            <div key={comm.id} className="comm-container">
                                <div className="comm-menu">
                                    <button
                                        className="menu-btn delete-btn"
                                        onClick={() => openConfirmation(() => handleDeleteComm(comm.id), "Ви впевнені, що хочете видалити коментар?")}
                                    >
                                        <img
                                            src={deleteIcon}
                                            alt="delete icon"
                                            className="menu-img"
                                        />
                                    </button>
                                    <button
                                        className="menu-btn hide-btn"
                                        onClick={() => handleHideComm(comm.id)}
                                    >
                                        <img
                                            src={inactiveIcon}
                                            alt="inactive icon"
                                            className="menu-img"
                                        />
                                    </button>
                                    <button
                                        className="menu-btn edit-btn"
                                    onClick={() => openEditModal(comm.id, "comment")}
                                    >
                                        <img
                                            src={editIcon}
                                            alt="edit icon"
                                            className="menu-img"
                                        />
                                    </button>
                                </div>
                                <Comment key={comm.id} comment={comm} />
                            </div>
                        ))}
                    </div>
                )}
                {showComments && userComments.length === 0 && (
                    <p>У вас ще немає комментарів.</p>
                )}

                <ConfirmationModal
                    isOpen={isConfirmationOpen}
                    onClose={() => setIsConfirmationOpen(false)}
                    onConfirm={handleConfirmAction}
                    message={confirmationMessage}
                />

                <EditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEdit}
                    initialData={editData}
                    type={isEdit}
                />
            </div>
        </div>
    );
};

export default MyProfilePage;
