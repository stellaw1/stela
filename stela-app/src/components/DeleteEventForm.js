// src/components/DeleteEventForm.js
import React, { useState } from 'react';
import { deleteEvent } from '../services/api';

const DeleteEventForm = () => {
    const [initial, setInitial] = useState('');
    const [gym, setGym] = useState('');
    const [day, setDay] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEvent = { initial, gym, day };
        await deleteEvent(newEvent);
        setInitial('');
        setGym('');
        setDay('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Delete a New Event</h2>
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
                    value={gym}
                    onChange={(e) => setGym(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Day</label>
                <input
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Delete Event</button>
        </form>
    );
};

export default DeleteEventForm;

