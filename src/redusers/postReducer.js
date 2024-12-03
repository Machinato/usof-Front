const initialState = {
    posts: [],
    sortBy: 'date',
    filter: 'all',
    isLoading: false,
    hasMore: true,
    // dataLength: 0
};

export const postsReducer = (state = initialState, action) => {
    console.log(action.type)
    switch (action.type) {
        case 'SET_POSTS':
            return { ...state, posts: [...state.posts, ...action.payload] };
        case 'SET_SORT_BY':
            return { ...state, sortBy: action.payload };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_HAS_MORE':
            console.log("SET_HAS_MORE")
            console.log(action.payload)
            return { ...state, hasMore: action.payload };
        case 'FETCH_POSTS_START':
            return { ...state, isLoading: true };
        case 'CLEAR_POSTS':
            return {
                ...state,
                posts: [],
                hasMore: true,
            };
        // case 'SET_DATA_LENGTH':
        //     return { ...state, dataLength: action.payload };
        default:
            return state;
    }
};

export default postsReducer;