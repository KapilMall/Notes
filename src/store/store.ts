import { configureStore } from "@reduxjs/toolkit";
import { notesSlice } from "../Slices/notesSlice";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

//persist configuratiom
const persistConfig = {
    key: 'root',
    storage
}

//create a persisted reducer
const persistedNoteReducer = persistReducer(persistConfig, notesSlice.reducer);

export const store = configureStore({
    reducer: {
        notes: persistedNoteReducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types from redux-persist
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // Ignore these paths in actions (redux-persist adds functions here)
                ignoredActionPaths: ['register', 'rehydrate'],
            }
        })
})

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch