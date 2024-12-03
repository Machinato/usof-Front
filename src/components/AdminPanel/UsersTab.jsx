import React, { useState, useEffect } from 'react';
import { allUsers, deleteUser, updateUser, addUser } from '../../api/userApi';
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:3001";

const restrictedFields = {
    user: ['id', 'role', 'rating', 'profile_picture'],
    admin: ['id', 'profile_picture', 'rating']
};

const UsersPanel = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newUser, setNewUser] = useState({
        login: '',
        full_name: '',
        email_address: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        is_activated: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await allUsers();
                setUsers(response.data.data);
            } catch (error) {
                toast.error("Failed to load users");
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    const handleEditUser = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleCreateUser = () => {
        setNewUser({
            login: '',
            full_name: '',
            email_address: '',
            password: '',
            confirmPassword: '',
            role: 'user',
            is_activated: 0
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (isEditing) {
            setCurrentUser(prev => ({ ...prev, [name]: value }));
        } else {
            setNewUser(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        if (newUser.password !== newUser.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
    
        // Створюємо копію об'єкта newUser або currentUser без полів id, role та is_activated
        const userToSubmit = isEditing ? { ...currentUser } : { ...newUser };
    
        // Видаляємо непотрібні поля
        delete userToSubmit.id;  // Не передавати id в body
        delete userToSubmit.role;  // Не передавати role в body
        delete userToSubmit.is_activated;  // Не передавати is_activated в body
        delete userToSubmit.profile_picture;  // Не передавати is_activated в body
        delete userToSubmit.rating;
        
        try {
            if (isEditing) {
                // Оновлюємо існуючого користувача
                await updateUser(currentUser.id, userToSubmit);
                setUsers(users.map(user => (user.id === currentUser.id ? { ...user, ...userToSubmit } : user)));
                toast.success("User updated successfully");
            } else {
                // Створюємо нового користувача
                await addUser(userToSubmit);
                setUsers([...users, userToSubmit]);
                toast.success("New user created successfully");
            }
            setIsModalOpen(false);
            setError('');
        } catch (error) {
            toast.error("Failed to save user");
        }
    };
    

    const renderUserFields = () => {
        const fields = isEditing ? currentUser : newUser; // Тут fields визначається як поточний або новий користувач
        const role = fields.role;
        const restricted = restrictedFields[role] || [];

        return Object.keys(fields).map(field => {
            // Якщо поле належить до заборонених або воно не є важливим для форми, пропустити його
            if (restricted.includes(field)) return null;

            // Додатково не показуємо пароль та підтвердження пароля при редагуванні користувача
            if (field === 'confirmPassword') {
                if (isEditing) return null;  // Не показувати ці поля при редагуванні
            }

            return (
                <div key={field}>
                    <label>{field.replace('_', ' ').toUpperCase()}</label>
                    <input
                        type={field.includes('password') ? 'password' : 'text'}  // для пароля приховуємо введення
                        name={field}
                        value={fields[field]}
                        onChange={handleChange}
                    />
                </div>
            );
        });
    };

    return (
        <div>
            <h2>Users</h2>
            <button className="admin-panel-button" onClick={handleCreateUser}>Create New User</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Profile Picture</th>
                        <th>Rating</th>
                        <th>Role</th>
                        <th>Activated</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.login}</td>
                            <td>{user.full_name}</td>
                            <td>{user.email_address}</td>
                            <td>
                                {user.profile_picture ? (
                                    <img src={`${BASE_URL}${user.profile_picture}`} alt="Profile" width="50" height="50" />
                                ) : (
                                    <span>No Picture</span>
                                )}
                            </td>
                            <td>{user.rating}</td>
                            <td>{user.role}</td>
                            <td>{user.is_activated ? 'Yes' : 'No'}</td>
                            <td>
                                <button className="admin-panel-button" onClick={() => handleEditUser(user)}>Edit</button>
                                <button className="admin-panel-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-admin-panel">
                    <h3>{isEditing ? 'Edit User' : 'Create User'}</h3>
                    <form>
                        {renderUserFields()}
                        {/* {!isEditing && (
                            <>
                                <div>
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={newUser.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )} */}
                        <div>
                            <label>Role</label>
                            <select name="role" value={isEditing ? currentUser.role : newUser.role} onChange={handleChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label>Activated</label>
                            <select name="is_activated" value={isEditing ? currentUser.is_activated : newUser.is_activated} onChange={handleChange}>
                                <option value={1}>Activated</option>
                                <option value={0}>Inactivated</option>
                            </select>
                        </div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        <div>
                            <button className="admin-panel-button" type="button" onClick={handleSubmit}>
                                {isEditing ? 'Update User' : 'Create User'}
                            </button>
                            <button className="admin-panel-button" type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UsersPanel;
