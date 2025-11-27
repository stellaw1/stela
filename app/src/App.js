// src/App.js
import './App.css';
import React, { useEffect, useState } from 'react';
import EventTable from './components/EventTable';
import EventForm from './components/EventForm';
import Footer from './components/Layout/Footer';
import { getGyms, getEvents } from './services/api';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [gyms, setGyms] = useState([]);
    const [events, setEvents] = useState(null);

    // Called when any event or gym is added, triggers EventTable refresh
    const handleEventAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const fetchData = async () => {
            const [gymsData, eventsData] = await Promise.all([
                getGyms(),
                getEvents()
            ]);
            setGyms(gymsData);
            setEvents(eventsData);
        };
        fetchData();
    }, [refreshTrigger]);

    const handleGymAdded = () => setRefreshTrigger(prev => prev + 1);

    return (
        <div className="app-container">
            <header className="app-header">
                when2boulder
            </header>
            <div className="panel">
                <EventTable
                    refreshTrigger={refreshTrigger}
                    onGymAdded={handleGymAdded}
                    gyms={gyms}
                    events={events}
                />
            </div>
            <div className="panel">
                <EventForm
                    onEventAdded={handleEventAdded}
                    gyms={gyms}
                    events={events}
                />
            </div>
            <div className="footer-container">
                <Footer />
            </div>
        </div>
    );
}

export default App;
