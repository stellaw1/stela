// src/components/EventForm.js
import React, { useState } from 'react';
import { addEvent, deleteEvent } from '../services/api';

const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const EventForm = ({ onEventAdded }) => {
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

        const newEvent = {
            initial,
            gym,
            day: day
        };

        await deleteEvent(newEvent);

        setInitial('');
        setGym('');
        setDay('');

        if (onEventAdded) {
            onEventAdded();
        }
    };

    return (
        <form onSubmit={handleAdd} className="add-event-form">
            <div>
                <label>Initial</label>
                <input
                    type="text"
                    value={initial}
                    onChange={(e) => setInitial(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Gym</label>
                <input
                    type="text"
                    value={gym}
                    onChange={(e) => setGym(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Day</label>
                <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a day</option>
                    {daysOfWeek.map(d => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>
            </div>

            <div className="button-row">
                <button type="submit">Add Event</button>
                <button type="button" className="delete-btn" onClick={handleDelete}>Delete Event</button>
            </div>
        </form>
    );
};

export default EventForm;
