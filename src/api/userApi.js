import api from "./index"

export const allUsers = () => {
    return api.get('users/');
}

export const allUserInform = (author_id) => {
    return api.get(`users/${author_id}/get_user_inform_for_post`);
}

export const getAllFavorite = () => {
    return api.get(`users/favorite`);
}

export const getUserById = (user_id) => {
    return api.get(`users/${user_id}`);
}

export const addUser = (userParams) => {
    return api.post(`users/`, { ...userParams });
}

export const updateAvatar = (formData) => {
    return api.patch(`users/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const updateUser = (user_id, updateUserParams) => {
    return api.patch(`users/${user_id}`, { ...updateUserParams });
}

export const deleteUser = (user_id) => {
    return api.delete(`users/${user_id}`);
}

export const userRating = (user_id) => {
    return api.get(`users/${user_id}/rating`);
}

export const ownUserRating = () => {
    return api.get(`users/rating`);
}

export const addToFavorite = (post_id) => {
    return api.post(`users/favorite/${post_id}`);
}

export const deleteFavoritePost = (post_id) => {
    return api.delete(`users/favorite/${post_id}/delete`);
}

export const favoriteCheck = (check_id) => {
    return api.get(`users/favorite-check/${check_id}`);
}

