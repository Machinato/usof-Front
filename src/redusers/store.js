import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReduce from './authReduser';
import postReduce from './postReducer';
import storage from "redux-persist/lib/storage";


const authPersistConfig ={
    key: 'auth',
    storage,
}

const persistedAuthReduser = persistReducer(authPersistConfig, authReduce)

const store = configureStore({
    reducer: {
        auth: persistedAuthReduser,
        posts: postReduce
    },
})

const persistor = persistStore(store);

export { store, persistor };