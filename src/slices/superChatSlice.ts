import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { SuperChatInfo } from '@/Types';

interface SuperChatState {
	superChatInfo: SuperChatInfo | null;
	loading: boolean;
	error: string | null;
}

const initialState: SuperChatState = {
	superChatInfo: null,
	loading: false,
	error: null
};

export const startSuperChat = createAsyncThunk<void, void, { state: RootState }>(
	'superChat/start',
	async (_, thunkApi) => {
		const state = thunkApi.getState();
		const address = state.server.address;
		const res = await fetch(`${address}/superchat/start`, { method: 'POST' });
		if(!res.ok) throw new Error(`Failed to start super chat: ${res.status}`);
	}
);

export const stopSuperChat = createAsyncThunk<void, void, { state: RootState }>(
	'superChat/stop',
	async (_, thunkApi) => {
		const state = thunkApi.getState();
		const address = state.server.address;
		const res = await fetch(`${address}/superchat/stop`, { method: 'POST' });
		if(!res.ok) throw new Error(`Failed to stop super chat: ${res.status}`);
	}
);

export const superChatSlice = createSlice({
	name: 'superChat',
	initialState,
	reducers: {
		setSuperChatInfo: (state, action: PayloadAction<SuperChatInfo | null>) => {
			state.superChatInfo = action.payload;
		}
	},
	extraReducers: builder => {
		builder.addCase(startSuperChat.pending, state => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(startSuperChat.fulfilled, state => {
			state.loading = false;
		});
		builder.addCase(startSuperChat.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || 'Failed';
		});
		builder.addCase(stopSuperChat.pending, state => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(stopSuperChat.fulfilled, state => {
			state.loading = false;
		});
		builder.addCase(stopSuperChat.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || 'Failed';
		});
	}
});

export const { setSuperChatInfo } = superChatSlice.actions;
export const getSuperChat = (state: RootState) => state.superChat.superChatInfo;
export const getSuperChatState = (state: RootState) => state.superChat;
export default superChatSlice.reducer;
