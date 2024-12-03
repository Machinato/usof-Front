import { allPostsWithFilter } from "../api/postApi";

const LIMIT = 9;

export const fetchPosts = (filters) => async (dispatch) => {
    dispatch({ type: 'FETCH_POSTS_START' });

    await allPostsWithFilter({
        category: filters.category,
        authorId: filters.authorId,
        status: filters.status,
        search: filters.search,
        sortBy: filters.sortBy,
        order: filters.order,
        page: filters.page

    }).then(response => {
        // console.log("response", response.data.data)
        console.log("response.data.data.posts", response.data.data.posts)
        const posts = response.data.data.posts;
        dispatch({ type: 'SET_POSTS', payload: posts });
        // console.log(posts)
        // console.log("Doshli do suda 2") 
        if (posts.length < LIMIT || posts.length === 0) { // Припустимо, що ми отримуємо по 10 постів
            // console.log("SET_HAS_MORE FALSE")
            dispatch({ type: 'SET_HAS_MORE', payload: false });
        } else {
            // console.log("SET_HAS_MORE TRUE")
            dispatch({ type: 'SET_HAS_MORE', payload: true });
        }
        // dispatch({ type: 'SET_DATA_LENGTH', payload: posts.length});
    }).catch(error => {
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

export const clearPosts = () => ({
    type: 'CLEAR_POSTS',
});
