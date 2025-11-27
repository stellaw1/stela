// src/components/EventForm.js
import React, { useState } from 'react';
import { addEvent, deleteEvent } from '../services/api';
import './EventForm.css';

const EventForm = ({ onEventAdded, gyms, events}) => {
    const [name, setName] = useState('');
    const [gym, setGym] = useState('');
    const [date, setDay] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        const newEvent = {
            name,
            gym,
            date
        };

        await addEvent(newEvent);

        setName('');
        setGym('');
        setDay('');

        if (onEventAdded) {
            onEventAdded();
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const newEvent = { name, gym, date };

        await deleteEvent(newEvent);

        setName('');
        setGym('');
        setDay('');

        if (onEventAdded) onEventAdded();
    };

    if (events === null || gyms === null) {
        return <div>Loading...</div>;
    }
    return (
        <form onSubmit={handleAdd} className="add-event-form">
            <div>
                <label className="form-label">Name</label>
                <input
                    className="form-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="form-label">Gym</label>
                <select
                    className="form-select"
                    value={gym}
                    onChange={(e) => setGym(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a gym</option>
                    {gyms.map((gym) => (
                        <option key={gym} value={gym}>{gym}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="form-label">Day</label>
                <select
                    className="form-select"
                    value={date}
                    onChange={(e) => setDay(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a date</option>
                    {Object.keys(events).sort().map((day) => {
                        const dateObj = new Date(day + "T00:00:00-08:00");
                        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                        const dayNum = dateObj.getDate();
                        const display = `${weekday} ${month} ${dayNum}`;
                        return (
                            <option key={day} value={day}>{display}</option>
                        );
                    })}
                </select>
            </div>

            <div className="button-row">
                <button type="submit" className="add-btn">Add Event</button>
                <button
                    type="button"
                    className="delete-btn"
                    onClick={handleDelete}
                >
                    Delete Event
                </button>
            </div>
        </form>
    );
};

export default EventForm;
