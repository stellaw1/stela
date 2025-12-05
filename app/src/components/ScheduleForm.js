// src/components/ScheduleForm.js
import React, { useState } from 'react';
import { addEvent, deleteEvent } from '../services/api';
import { isPastDate } from '../utils/dateHelpers';
import './ScheduleForm.css';

const ScheduleForm = ({ onEventAdded, gyms, events}) => {
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

        if (onEventAdded) {
            onEventAdded();
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const newEvent = { name, gym, date };

        await deleteEvent(newEvent);

        if (onEventAdded) onEventAdded();
    };

    if (events === null || gyms === null) {
        return <div>Loading...</div>;
    }

    const availableDates = Object.keys(events).sort().filter(date => !isPastDate(date));
    
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
                    {availableDates.map((day) => {
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

export default ScheduleForm;
