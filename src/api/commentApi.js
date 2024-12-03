import api from "./index"

export const getAllCommets = () => {
    return api.get(`comments/`);
}

export const getCommet = (commentId) => {
    return api.get(`comments/${commentId}`);
}

export const getAllOwnCommets = () => {
    return api.get(`comments/own-coments`);
}

export const getAllLikes = (commentId) => {
    return api.get(`comments/${commentId}/like`);
}

export const addLike = (commentId, likeType) => {
    return api.post(`comments/${commentId}/like`, likeType);
}

export const updateComment = (commentId, NewData) => {
    return api.patch(`comments/${commentId}`, NewData);
}

export const deleteComment = (commentId) => {
    return api.delete(`comments/${commentId}`);
}

export const deleteLikesOnComment = (commentId) => {
    return api.delete(`comments/${commentId}/like`);
}

export const updateStatusComment = (commentId) => {
    return api.patch(`comments/${commentId}/status`);
}

