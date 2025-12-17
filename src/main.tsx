import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

createRoot(document.getElementById('root')!).render(
	<React.Fragment>
			<BrowserRouter>
				<main className="w-full mx-auto" style={{ maxWidth: "80rem" }}>
					<App />
				</main>
			</BrowserRouter>
	</React.Fragment>,
);
