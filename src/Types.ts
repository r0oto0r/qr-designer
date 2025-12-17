export type ChatMessage = {
	channel: string;
	user: string;
	message: string;
	timestamp: number;
};

export type ChannelState = {
	active: boolean;
	history: ChatMessage[];
};

export type MessageFilter = {
	startsWith?: string;
	since?: number;
	until?: number;
	lastMinutes?: number;
	uniqueUsers?: boolean;
};

export type PromptWorking = { working: boolean };
export type PromptResult = { prompt: string; response: string; messagesUsed: number; timestamp?: number };
export type ChannelInfo = { name: string | null; active: boolean; messageCount: number };
export type SuperChatInfo = { active: boolean, messageCount: number };
export type RunLLMPayload = { prompt: string; filter?: MessageFilter; }

export enum SocketMessageType {
	ChannelInfo = 'channel:info',
	PromptWorking = 'prompt:working',
	PromptResult = 'prompt:result',
	SuperChatInfo = 'superChat:info'
};
