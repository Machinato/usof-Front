import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, clearPosts } from '../../redusers/actions'; // Оновлений імпорт
import PostItem from '../post/PostItem';
import { getAllCategory } from '../../api/categoryApi';
import InfiniteScroll from 'react-infinite-scroll-component'; // Імпортуємо InfiniteScroll
import '../../styles/MainPage.css';
import HeaderItem from "../../components/Header/headerItem";
import { useNavigate, Link } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const posts = useSelector(state => state.posts);
    const hasMore = useSelector(state => state.posts.hasMore);
    const [categories, setCategories] = useState([]);//Для всіх категорій 
    const [category, setCategory] = useState([]);
    const [authorId, setAuthorId] = useState(null);
    const [status, setStatus] = useState('active');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [order, setOrder] = useState('ASC');
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);
    // const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        console.log("Finding posts...");

        dispatch(clearPosts());

        const filters = { category, authorId, status, search, sortBy, order, page: 1 };
        dispatch(fetchPosts(filters)); // Завантаження постів для нових фільтрів
    }, [category, authorId, status, search, sortBy, order, dispatch]);

    // Логіка для завантаження наступної сторінки
    useEffect(() => {
        if (page > 1) {
            const filters = { category, authorId, status, search, sortBy, order, page };
            dispatch(fetchPosts(filters)); // Завантаження наступної сторінки
        }
    }, [page, dispatch, category, authorId, status, search, sortBy, order]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getAllCategory();
                setCategories(response.data.data); // Передбачаємо, що API повертає масив категорій у `categories`
            } catch (error) {
                console.error("Помилка при завантаженні категорій:", error);
            }
        };
        fetchCategories();
    }, []);

    // useEffect(() => {
    //     // console.log("Finding posts...");
    //     // console.log(posts.length);
    // }, [posts]);

    // Логіка для завантаження наступної сторінки
    const fetchNextPosts = () => {
        console.log("Page", page)
        setPage((prevPage) => prevPage + 1);
    };

    if (!posts.posts || posts.posts.length === 0) {
        console.log("Завантаження постів...")
        return <p>Завантаження постів...</p>; // Або інший лоадер
    }

    // const goToPostPage = (postId) => {
    //     navigate(`/posts/${postId}`)
    // };

    // console.log("posts.posts.length : ")
    // console.log(posts.posts.length)
    // console.log('Redux hasMore:', hasMore);
    // console.log("First page:", page);
    // console.log("Page", page)

    return (
        <div>
            <HeaderItem />
            <div className='all-Page-Main'>
                <div className="main-page">
                    <h1>Main page</h1>
                    <div className="filters">
                        <div className="input-search">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by name"
                            />
                            <button onClick={() => setSearch(searchInput)}>Search</button>
                        </div>

                        {/* Кнопка для відкриття/закриття селектів */}
                        <button
                            className="toggle-filters-btn"
                            onClick={() => setFiltersVisible(!filtersVisible)}
                        >
                            {filtersVisible ? "▲ Close the filters" : "▼ Open filters"}
                        </button>

                        {/* Селекти, які показуються/ховаються */}
                        <div className={`filters-dropdown ${filtersVisible ? 'visible' : ''}`}>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="publish_date">Date</option>
                                <option value="like_count">Likes</option>
                                <option value="title">Tetle</option>
                                <option value="author_id">Autor</option>
                            </select>
                            <select value={order} onChange={(e) => setOrder(e.target.value)}>
                                <option value="DESC">Decline</option>
                                <option value="ASC">Increase</option>
                            </select>
                            <select value={category} onChange={(e) => {
                                const value = e.target.value;
                                setCategory(value === 'all' ? [] : [value]);
                            }}>
                                <option value="all">All categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <InfiniteScroll
                    dataLength={posts.posts.length}
                    next={fetchNextPosts}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={<p>There are no more posts</p>}
                >
                    <div className="posts">
                        {posts.posts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default MainPage;
