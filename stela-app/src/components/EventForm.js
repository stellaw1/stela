// src/components/EventForm.js
import React, { useState } from 'react';
import { addEvent, deleteEvent } from '../services/api';
import './EventForm.css';

const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
});
const EventForm = ({ onEventAdded, gyms }) => {
    const [initial, setInitial] = useState('');
    const [gym, setGym] = useState('');
    const [day, setDay] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();

        const newEvent = {
            initial,
            gym,
            day: day
        };

        await addEvent(newEvent);

        setInitial('');
        setGym('');
        setDay('');

        if (onEventAdded) {
            onEventAdded();
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const newEvent = { initial, gym, day };

        await deleteEvent(newEvent);

        setInitial('');
        setGym('');
        setDay('');

        if (onEventAdded) onEventAdded();
    };

    return (
        <form onSubmit={handleAdd} className="add-event-form">
            <div>
                <label className="form-label">Initial</label>
                <input
                    className="form-input"
                    type="text"
                    value={initial}
                    onChange={(e) => setInitial(e.target.value.toUpperCase())}
                    required
                />
            </div>

            {/* 🆕 Dropdown replaces the previous Gym input */}
            <div>
                <label className="form-label">Gym</label>
                <select
                    className="form-select"
                    value={gym}
                    onChange={(e) => setGym(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a gym</option>
                    {gyms.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="form-label">Day</label>
                <select
                    className="form-select"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a day</option>
                    {days.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
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
