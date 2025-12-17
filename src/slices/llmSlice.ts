import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { PromptResult, RunLLMPayload } from '@/Types';

interface LLMState {
	currentResult: PromptResult | null;
	resultHistory: PromptResult[];
	loading: boolean;
	error: string | null;
}

const initialState: LLMState = {
	currentResult: null,
	resultHistory: [],
	loading: false,
	error: null
};

export const runLLM = createAsyncThunk<void, RunLLMPayload, { state: RootState }>(
	'llm/run',
	async (payload, thunkApi) => {
		const state = thunkApi.getState();
		const address = state.server.address;
		const res = await fetch(`${address}/prompt/run`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if(res.status === 409) throw new Error('A prompt job is already running');
		if(!res.ok) throw new Error(`Failed to run prompt: ${res.status}`);
	}
);

export const clearCollectedMessages = createAsyncThunk<void, void, { state: RootState }>(
	'llm/clearCollectedMessages',
	async (_, thunkApi) => {
		const state = thunkApi.getState();
		const address = state.server.address;
		const res = await fetch(`${address}/collect/clear`, { method: 'POST' });
		if(!res.ok) throw new Error(`Failed to clear messages: ${res.status}`);
	}
);

export const llmSlice = createSlice({
	name: 'llm',
	initialState,
	reducers: {
		setPromptResult: (state, action: PayloadAction<PromptResult>) => {
			const withTs = action.payload.timestamp ? action.payload : { ...action.payload, timestamp: Date.now() };
			state.currentResult = withTs;
			state.resultHistory = [ withTs, ...state.resultHistory ].slice(0, 100);
		}
	},
	extraReducers: builder => {
		builder.addCase(runLLM.pending, state => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(runLLM.fulfilled, state => {
			state.loading = false;
		});
		builder.addCase(runLLM.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message || 'Failed';
		});
			builder.addCase(clearCollectedMessages.pending, state => {
				state.error = null;
			});
			builder.addCase(clearCollectedMessages.rejected, (state, action) => {
				state.error = action.error.message || 'Failed';
			});
	}
});

export const { setPromptResult } = llmSlice.actions;
export const getLLM = (state: RootState) => state.llm;
export default llmSlice.reducer;
