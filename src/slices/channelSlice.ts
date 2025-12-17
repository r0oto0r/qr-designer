import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { ChannelInfo } from '@/Types';

interface ChannelState {
	channelInfo: ChannelInfo | null;
	loading: boolean;
	error: string | null;
}

const initialState: ChannelState = {
	channelInfo: null,
	loading: false,
	error: null
};

export const startChannel = createAsyncThunk<void, string, { state: RootState }>(
	'channel/startChannel',
	async (channelName, thunkApi) => {
		const state = thunkApi.getState();
		const address = state.server.address;
		const url = `${address}/collect/start/${encodeURIComponent(channelName)}`;
		const res = await fetch(url, { method: 'POST' });
		if(!res.ok) throw new Error(`Failed to start channel: ${res.status}`);
	}
);

export const stopChannel = createAsyncThunk<void, string, { state: RootState }>(
	'channel/stopChannel',
	async (channelName, thunkApi) => {
		const state = thunkApi.getState();
		const address = state.server.address;
		const url = `${address}/collect/stop/${encodeURIComponent(channelName)}`;
		const res = await fetch(url, { method: 'POST' });
		if(!res.ok) throw new Error(`Failed to stop channel: ${res.status}`);
	}
);

export const channelSlice = createSlice({
	name: 'channel',
	initialState,
	reducers: {
		setChannelInfo: (state, action: PayloadAction<ChannelInfo | null>) => {
			state.channelInfo = action.payload;
		}
	},
	extraReducers: builder => {
		builder.addCase(startChannel.pending, state => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(startChannel.fulfilled, state => {
			state.loading = false;
		});
		builder.addCase(startChannel.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || 'Failed';
		});
		builder.addCase(stopChannel.pending, state => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(stopChannel.fulfilled, state => {
			state.loading = false;
		});
		builder.addCase(stopChannel.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || 'Failed';
		});
	}
});

export const { setChannelInfo } = channelSlice.actions;
export const getChannel = (state: RootState) => state.channel.channelInfo;
export const getChannelState = (state: RootState) => state.channel;
export default channelSlice.reducer;
