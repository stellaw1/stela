// src/App.js
import React from 'react';
import EventList from './components/EventList';
import AddEventForm from './components/AddEventForm';
import DeleteEventForm from './components/DeleteEventForm';

function App() {
    return (
        <div className="App">
            <h1>when2boulder</h1>
            <AddEventForm />
            <DeleteEventForm />
            <EventList />
        </div>
    );
}

export default App;

