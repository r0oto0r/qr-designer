import { io, Socket } from 'socket.io-client';
import { setConnected } from '../slices/serverSlice';
import store from '../store/store';
import { setPromptResult } from '../slices/llmSlice';
import { setChannelInfo } from '../slices/channelSlice';
import { SocketMessageType, PromptResult, ChannelInfo, SuperChatInfo } from '@/Types';
import { setSuperChatInfo } from '../slices/superChatSlice';

export class SocketClient {
	private static socket: Socket;
	private static serverAddress: string;

	public static init(serverAddress: string) {
		this.serverAddress = serverAddress;
		this.connectToServer();
	}

	public static connectToServer() {
		this.initSocket();
	}

	public static disconnectFromServer() {
		if(this.socket) {
			this.socket.offAny();
			this.socket.disconnect();
			this.socket.close();
		}
	}

	private static initSocket() {
		if(this.socket) {
			this.socket.offAny();
			this.socket.disconnect();
			this.socket.close();
		}

		console.log(`connecting to ${this.serverAddress}`);

		this.socket = io(this.serverAddress, {
			transports: [ 'websocket' ]
		});

		this.socket.on('connect', () => {
			console.log(`connected to ${this.serverAddress}`);
			store.dispatch(setConnected(true));

			this.socket.on(SocketMessageType.PromptResult, (result: PromptResult) => {
				store.dispatch(setPromptResult(result));
			});
			this.socket.on(SocketMessageType.ChannelInfo, (info: ChannelInfo) => {
				store.dispatch(setChannelInfo(info));
			});
			this.socket.on(SocketMessageType.SuperChatInfo, (info: SuperChatInfo) => {
				store.dispatch(setSuperChatInfo(info));
			});
		});

		this.socket.on('disconnect', () => {
			console.log(`disconnected from ${this.serverAddress}`);
			store.dispatch(setConnected(false));
		});

		this.socket.on('error', error => {
			console.error(error);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static emit(messageType: string, data?: any) {
		if(this.socket) {
			this.socket.emit(messageType, data);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static on(messageType: string, callback: (data: any) => void) {
		if(this.socket) {
			this.socket.on(messageType, callback);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static off(messageType: string, callback: (data: any) => void) {
		if(this.socket) {
			this.socket.off(messageType, callback);
		}
	}
}
