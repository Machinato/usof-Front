import React, { useState } from "react";
import PostItem from "./PostItem";
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../../redusers/actions';

const PostsList = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    // const isLoading = useSelector((state) => state.posts.isLoading);

    useEffect(() => {
        const filters = { category, authorId, status, search, sortBy, order, page };
        dispatch(fetchPosts(filters)); // Викликаємо action для отримання постів з фільтрацією
    }, [category, authorId, status, search, sortBy, order, page, dispatch]);

    // if (isLoading) {
    //     return <p>Завантаження...</p>; // Показуємо індикатор завантаження
    // }

    return (
        <div>
            {posts.map(post => (
                <Post key={post.id} data={post} />
            ))}
        </div>
    );
};

export default PostsList;