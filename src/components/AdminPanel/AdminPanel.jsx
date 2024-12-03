import React, { useState } from 'react';
import UsersPanel from './UsersTab';
import PostsPanel from './PostsTab';
import CommentsPanel from './CommentsTab';
import HeaderItem from "../../components/Header/headerItem";
import "../../styles/AdminPanel.css"

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div>
            <HeaderItem />
            <div className='admin-panel'>
                <h1>Admin Panel</h1>
                <div>
                    <button onClick={() => setActiveTab('users')}>Users</button>
                    <button onClick={() => setActiveTab('posts')}>Posts</button>
                    <button onClick={() => setActiveTab('comments')}>Comments</button>
                </div>

                {activeTab === 'users' && <UsersPanel />}
                {activeTab === 'posts' && <PostsPanel />}
                {activeTab === 'comments' && <CommentsPanel />}
            </div>

        </div>
    );
};

export default AdminPanel;
