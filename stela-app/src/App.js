// src/App.js
import './App.css';
import React, { useEffect, useState } from 'react';
import EventTable from './components/EventTable';
import EventForm from './components/EventForm';
import { getGyms } from './services/api';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [gyms, setGyms] = useState([]);

    // Called when any event or gym is added, triggers EventTable refresh
    const handleEventAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const fetchGyms = async () => {
        const gymsData = await getGyms();
        setGyms(gymsData);
        };
        fetchGyms();
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
                    onGymAdded={handleGymAdded} // notify App when gyms change
                />
            </div>
            <div className="panel">
                <EventForm
                    onEventAdded={handleEventAdded} 
                    gyms={gyms} // use latest gyms in dropdown
                />
            </div>
        </div>
    );
}

export default App;
