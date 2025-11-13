// src/App.js
import './App.css';

import React, { useState } from 'react';
import EventTable from './components/EventTable';
import EventForm from './components/EventForm';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [gyms, setGyms] = useState([]);

    const handleEventAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                when2boulder
            </header>
            <div className="panel">
                <EventTable refreshTrigger={refreshTrigger} onGymsUpdated={setGyms} />
            </div>
            <div className="panel">
                <EventForm onEventAdded={handleEventAdded} gymsProp={gyms} />
            </div>
        </div>
    );
}

export default App;
