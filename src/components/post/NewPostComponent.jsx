import React, { useState, useEffect } from 'react';
import { addPostPictures, addPost } from '../../api/postApi.js';
import { getAllCategory } from '../../api/categoryApi.js';
import { toast } from "react-toastify";
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/NewPostForm.css"
// import CategoryItem from "../post/CategoriesItem.jsx"

const NewPostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        // Отримуємо всі категорії
        getAllCategory().then(response => {
            setCategories(response.data.data);
        });
    }, []);

    const handleFileChange = (e) => {
        setSelectedFiles([...selectedFiles, ...e.target.files]);
    };

    // const handleNewPhotos = (e) => {
    //     setNewPhotos([...newPhotos, ...e.target.files]);
    // };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        setSelectedCategories(prevState => {
            if (prevState.includes(value)) {
                return prevState.filter(item => item !== value);
            } else {
                return [...prevState, value];
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPostData = {
            title: title,
            content: content,
            categories: selectedCategories,
        };

        addPost(newPostData).then(response => {
            if (selectedFiles.length > 0) {
                const formData = new FormData();
                for (let file of selectedFiles) {
                    formData.append('images', file);
                }
                addPostPictures(response.data.data.post_id, formData).then(response => {
                    toast.success(response.data.message);

                }).catch();
            }
            setTitle('');
            setContent('');
            setSelectedCategories([]);
            setSelectedFiles([]);
        }).catch()
    };

    return (
        <div className='all-new-post-page'>
            <HeaderItem />
            <div className='new-post-form'>
                <h1>New post</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input
                            className='new-post-input'
                            placeholder='Enter title...'
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Content:</label>
                        <textarea
                            placeholder='Enter content...'
                            className='new-post-area'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Category:</label>
                        <select className='new-post-select' multiple value={selectedCategories} onChange={handleCategoryChange}>
                            {categories.map((category) => (
                                <option className="categories-options" key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Photos:</label>
                        <input className='new-post-input' type="file" multiple onChange={handleFileChange} />
                    </div>

                    <div>
                        <button className='new-post-button' type="submit">Add post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewPostForm;
