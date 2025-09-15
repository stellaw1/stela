// src/components/AddEventForm.js
import React, { useState } from 'react';
import { addEvent } from '../services/api';

const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const AddEventForm = ({ onEventAdded }) => {
    const [initial, setInitial] = useState('');
    const [gym, setGym] = useState('');
    const [day, setDay] = useState('');

    const handleSubmit = async (e) => {
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

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add a New Event</h2>
            
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

            <button type="submit">Add Event</button>
        </form>
    );
};

export default AddEventForm;
