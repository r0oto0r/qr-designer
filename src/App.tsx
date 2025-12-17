import './App.css'
import { Route, Routes } from 'react-router-dom';
import QRDesigner from './components/QRDesigner';

function App() {
	return (
		<Routes>
			<Route path="/" element={<QRDesigner />} />
		</Routes>
	)
}

export default App;
