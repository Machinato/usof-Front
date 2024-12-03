import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCategoryById } from "../../api/categoryApi"
import InfiniteScroll from 'react-infinite-scroll-component';
import HeaderItem from "../../components/Header/headerItem";
import PostItem from '../post/PostItem';
import '../../styles/CategoryPage.css';
import { fetchPosts, clearPosts } from '../../redusers/actions';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const hasMore = useSelector(state => state.posts.hasMore);
    const { categoryId } = useParams();
    const [category, setCategory] = useState({});
    const [page, setPage] = useState(1);
    // const [posts, setPosts] = useState([]);

    // Завантаження даних категорії та постів
    useEffect(() => {
        // Завантажити категорію за ID
        const handleLogout = async () => {
            await getCategoryById(categoryId)
                .then(response => {
                    console.log("response.data.data.name", response.data.data.name);
                    setCategory(response.data.data);
                    console.log("category", category)
                    console.log("category.name", category.name)
                    const filters = { category: response.data.data.name }

                    console.log("filters", filters)
                    dispatch(fetchPosts(filters));
                })
                .catch(error => {
                    console.error("Error fetching category", error);
                });
        }

        handleLogout();
    }, [categoryId]);

    useEffect(() => {
        dispatch(clearPosts());
    }, []);


    const fetchNextPosts = () => {
        console.log("Page", page)
        setPage((prevPage) => prevPage + 1);
    };

    if (!posts.posts || posts.posts.length === 0) {
        console.log("Завантаження постів...")
        return <p>Завантаження постів...</p>;
    }

    return (
        <div className="category-page">
            <HeaderItem />
            {category && (
                <div className="category-info">
                    <h1>{category.name}</h1>
                    <p>{category.description}</p>
                </div>
            )}
            <div className="posts-list">
                <h2>Posts in this category:</h2>
                <InfiniteScroll
                    dataLength={posts.posts.length}
                    next={() => setTimeout(fetchNextPosts, 500)}
                    hasMore={hasMore} // Якщо є ще пости
                    loader={<h4>Завантаження...</h4>}
                    endMessage={<p>Більше постів немає</p>}
                >
                    {/* <h1>{hasMore}</h1> */}
                    <div className="posts">
                        {/* <h1>{hasMore}</h1> */}
                        {posts.posts.length > 0 ? (
                            posts.posts.map((post) => (
                                <PostItem key={post.id} post={post} />
                            ))
                        ) : (
                            <p>Немає постів для відображення</p>
                        )}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default CategoryPage;
