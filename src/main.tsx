import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './store/store.ts';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

createRoot(document.getElementById('root')!).render(
	<React.Fragment>
		<Provider store={store}>
			<BrowserRouter>
				<main className="w-full mx-auto" style={{ maxWidth: "80rem" }}>
					<App />
				</main>
			</BrowserRouter>
		</Provider>
	</React.Fragment>,
);
