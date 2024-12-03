import api from "./index"

export const getAllCategory = () => {
    return api.get('categories/');
}

export const getCategoryById = (categoryId) => {
    return api.get(`categories/${categoryId}`);
}

export const getAllPostsByCategory = (categoryId) => {
    return api.get(`categories/${categoryId}/posts`);
}

export const addCategory = (categoryData) => {
    return api.post(`categories/`, categoryData);
}

export const changeCategory = (categoryId, categoryData) => {
    return api.patch(`categories/${categoryId}`, categoryData);
}

export const deleteCategory = (categoryId) => {
    return api.delete(`categories/${categoryId}`);
}