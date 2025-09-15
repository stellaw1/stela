// src/App.js
import './App.css';

import React, { useState } from 'react';
import EventTable from './components/EventTable';
import AddEventForm from './components/AddEventForm';
import DeleteEventForm from './components/DeleteEventForm';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleEventAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                when2boulder
            </header>
            <div className="panel">
                <AddEventForm onEventAdded={handleEventAdded} />
            </div>
            <div className="panel">
                <EventTable refreshTrigger={refreshTrigger} />
            </div>
        </div>
    );
}

export default App;
