import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import serverReducer from '../slices/serverSlice';
import llmSlice from '../slices/llmSlice';
import channelSlice from '../slices/channelSlice';
import superChatSlice from '../slices/superChatSlice';

const store: EnhancedStore = configureStore({
    reducer: {
		server: serverReducer,
		llm: llmSlice,
		channel: channelSlice,
		superChat: superChatSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
