import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllCommets, deleteComment, updateComment } from '../../api/commentApi';
import { addNewPostComment } from '../../api/postApi';

const CommentsTab = () => {
    const [comments, setComments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [newContent, setNewContent] = useState('');

    // Завантаження коментарів при монтуванні
    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            const response = await getAllCommets();
            if (response.data.data && Array.isArray(response.data.data)) {
                setComments(response.data.data);
            } else {
                toast.error('Invalid response structure');
            }
        } catch (err) {
            toast.error('Failed to load comments');
        }
    };

    // Відкриття модального вікна для редагування
    const openEditModal = (comment) => {
        setSelectedComment(comment);
        setNewContent(comment.content);
        setIsModalOpen(true);
    };

    // Закриття модального вікна
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedComment(null);
        setNewContent('');
    };

    // Оновлення коментаря
    const handleUpdateComment = async () => {
        try {
            await updateComment(selectedComment.id, { content: newContent });
            toast.success('Comment updated successfully');
            loadComments();
            closeModal();
        } catch (err) {
            toast.error('Failed to update comment');
        }
    };

    // Видалення коментаря
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            toast.success('Comment deleted successfully');
            loadComments();
        } catch (err) {
            toast.error('Failed to delete comment');
        }
    };

    // Оновлення статусу коментаря (active/inactive)
    const toggleCommentStatus = async (commentId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateComment(commentId, { status: newStatus });
            toast.success(`Comment status updated to ${newStatus}`);
            loadComments();
        } catch (err) {
            toast.error('Failed to update comment status');
        }
    };

    return (
        <div className="comments-tab">
            <h2>Comments</h2>
            <table className="comments-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Author ID</th>
                        <th>Post ID</th>
                        <th>Content</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment) => (
                            <tr key={comment.id}>
                                <td>{comment.id}</td>
                                <td>{comment.author_id}</td>
                                <td>{comment.post_id}</td>
                                <td>{comment.content}</td>
                                <td>
                                    <button className="comment-button-active" onClick={() => toggleCommentStatus(comment.id, comment.status)}>
                                        {comment.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                                <td>
                                    <button className="comment-button" onClick={() => openEditModal(comment)}>Edit</button>
                                    <button className="comment-button" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No comments available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {isModalOpen && selectedComment && (
                <div className="modal-comment">
                    <div className="modal-content-comment">
                        <h3>Edit Comment</h3>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows="4"
                            cols="50"
                        ></textarea>
                        <div className="modal-actions-comment">
                            <button className="comment-button" onClick={handleUpdateComment}>Save Changes</button>
                            <button className="comment-button" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentsTab;
