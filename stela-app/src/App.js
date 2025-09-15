// src/App.js
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
        <div className="App">
            <h1>when2boulder</h1>
            <AddEventForm onEventAdded={handleEventAdded} />
            {/* <DeleteEventForm /> */}
            <EventTable refreshTrigger={refreshTrigger} />
        </div>
    );
}

export default App;
