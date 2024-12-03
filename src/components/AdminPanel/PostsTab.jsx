import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { allPosts, removePost, updatePost, updateStatusPost } from '../../api/postApi';
import moment from 'moment'; // Для форматування дати

const PostsTab = () => {
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newContent, setNewContent] = useState('');
    const [newTitle, setNewTitle] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await allPosts();
            if (response.data.data.posts && Array.isArray(response.data.data.posts)) {
                setPosts(response.data.data.posts);
            } else {
                toast.error('Invalid response structure');
            }
        } catch (err) {
            toast.error('Failed to load posts');
        }
    };

    const openEditModal = (post) => {
        setSelectedPost(post);
        setNewContent(post.content);
        setNewTitle(post.title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        setNewContent('');
        setNewTitle('');
    };

    const handleUpdatePost = async () => {
        try {
            await updatePost(selectedPost.id, { content: newContent, title: newTitle });
            toast.success('Post updated successfully');
            loadPosts();
            closeModal();
        } catch (err) {
            toast.error('Failed to update post');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await removePost(postId);
            toast.success('Post deleted successfully');
            loadPosts();
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    const togglePostStatus = async (postId) => {
        try {
            await updateStatusPost(postId);
            toast.success('Post status updated');
            loadPosts();
        } catch (err) {
            toast.error('Failed to update post status');
        }
    };

    return (
        <div className="posts-tab">
            <h2>Posts</h2>
            <table className="posts-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Author ID</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Publish Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{post.author_id}</td>
                                <td>{post.title}</td>
                                <td>{post.content}</td>
                                <td>{moment(post.publish_date).format('DD MMM YYYY, HH:mm')}</td>
                                <td>
                                    <button onClick={() => togglePostStatus(post.id)}>
                                        {post.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => openEditModal(post)}>Edit</button>
                                    <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No posts available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && selectedPost && (
                <div className="modal-post">
                    <div className="modal-content-post">
                        <h3>Edit Post</h3>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <label>Content:</label>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows="4"
                            cols="50"
                        ></textarea>
                        <div className="modal-actions-post">
                            <button onClick={handleUpdatePost}>Save Changes</button>
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostsTab;
