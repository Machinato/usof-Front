const BASE_URL = "http://localhost:3001";
const defaultAvatar = "/uploads/avatars/avatar-default.png"

const initialState = {
    isAuth: false,
    user: {
        login: '',
        full_name: '',
        email_address: '' ,
        profile_picture: defaultAvatar,
        role: ''
    }
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            const profilePicture = action.payload.profile_picture 
                    ? action.payload.profile_picture.startsWith('http') // Перевіряємо, чи це повний URL
                    ? action.payload.profile_picture // Використовуємо як є
                    : `${BASE_URL}${action.payload.profile_picture}` // Додаємо BASE_URL
                    : `${BASE_URL}${defaultAvatar}`;
            console.log("authReducer LOG_IN user", action.payload)
            return {
                ...state,
                isAuth: true,
                user: {
                    login: action.payload.login,
                    profile_picture: profilePicture,
                    full_name: action.payload.full_name,
                    email_address: action.payload.email_address,
                    role: action.payload.role,
                }
            }
        case 'LOG_OUT':
            localStorage.removeItem('accessToken');
            return {
                ...state,
                isAuth: false,
                user: {profile_picture: `${BASE_URL}${defaultAvatar}`},
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                },
            };
        case "UPDATE_PROFILE_PICTURE":
            return {
                ...state,
                user: {
                    ...state.user,
                    profile_picture: `${BASE_URL}${action.payload}`
                },
            };
        default: 
            return state;
    }
};

export default authReducer;