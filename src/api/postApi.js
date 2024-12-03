import api from "./index"

export const allPosts = (user) => {
    return api.get('/posts/');
}

export const getPostById = (postId) => {
    return api.get(`/posts/${postId}`);
}

export const allPostsWithFilter = (filters) => {
    console.log("filters allPostsWithFilter", filters)
    return api.get(`/posts/with_filter`, { params: filters });
}

export const getAllCommentsForPost = (postId) => {
    return api.get(`/posts/${postId}/post_comments`);
}

export const getOwnPosts = () => {
    return api.get(`/posts/own_posts`);
}

// export const getAllCommentsForComm = (commId) => {
//     return api.get(`/posts/${commId}/comm_comments`);
// }

export const addNewPostComment = (postId, content) => {
    console.log("comm content", content)
    return api.post(`/posts/${postId}/post_comments`, content);
}

export const addNewCommentOnComment = (commId, content) => {
    return api.post(`/posts/${commId}/comm_comments`, content);
}

export const getAllCategoriesForPost = (postId) => {
    return api.get(`/posts/${postId}/categories`);
}

export const getAllLikesOnPost = (postId) => {
    return api.get(`/posts/${postId}/like`);
}

export const getAllLikesOnComm = (commId) => {
    console.log("commId", commId)
    return api.get(`/posts/${commId}/comment_like`);
}

export const likeCheck = (targetId, targetType) => {
    // console.log()
    return api.get(`/posts/${targetId}/like-check/${targetType}`);
}

export const addPost = (postInform) => {
    return api.post(`/posts/`, postInform);
}

export const addLikeToPost = (postId, type_like) => {
    console.log("type_like", type_like)
    return api.post(`/posts/${postId}/like`, type_like);
}

export const updatePost = (postId, postInform) => {
    console.log("postInform", postInform)
    return api.patch(`/posts/${postId}`, { content: postInform.content, title: postInform.title });
}

export const updateStatusPost = (postId) => {
    return api.patch(`/posts/${postId}/status`);
}

export const removePost = (postId) => {
    return api.delete(`/posts/${postId}`);
}

export const removeLikesOnPost = (postId) => {
    return api.delete(`/posts/${postId}/like`);
}

export const removeLikesOnComm = (postId) => {
    return api.delete(`/posts/${postId}/comment_like`);
}

export const addPostPictures = (postId, formData) => {
    return api.post(`/posts/${postId}/photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const getAllPhotosForPost = (postId) => {
    return api.get(`/posts/${postId}/photos`);
}

export const deletePostPictures = (postId, photoPath) => {
    console.log("deletePostPictures photoPath", photoPath);
    // Правильний шлях без "file="
    return api.delete(`/posts/${postId}/photos?photoPath=${encodeURIComponent(photoPath)}`);
};


export const addLikeToComment = (commId, type_like) => {
    return api.post(`/posts/${commId}/comment_like`, type_like);
}


