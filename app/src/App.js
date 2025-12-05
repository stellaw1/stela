// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import SchedulePage from './pages/SchedulePage';
import EventPage from './pages/EventPage';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <Routes>
                    <Route path="/" element={<SchedulePage />} />
                    <Route path="/event" element={<EventPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
