import { getCategoryById } from "../../api/categoryApi"

const LIMIT = 9;

export const fetchPosts = (categoryId) => async (dispatch) => {
    dispatch({ type: 'FETCH_POSTS_START' });

    getCategoryById(categoryId).then(response =>  {
        // console.log(response.data.data.posts)
        const posts = response.data.data;
        dispatch({ type: 'SET_POSTS', payload: posts });
     
        if (posts.length < LIMIT || posts.length === 0) {
            dispatch({ type: 'SET_HAS_MORE', payload: false });
        } else {
            dispatch({ type: 'SET_HAS_MORE', payload: true });
        }
    }).catch( error => {
        dispatch({ type: 'SET_LOADING' });
        console.error('Error fetching posts:', error)
    });
};

export const setSortBy = (sort) => ({
    type: 'SET_SORT_BY',
    payload: sort,
});

export const setFilter = (filter) => ({
    type: 'SET_FILTER',
    payload: filter,
});
