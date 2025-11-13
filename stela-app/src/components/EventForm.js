// src/components/EventForm.js
import React, { useState, useEffect } from 'react';
import { addEvent, deleteEvent, getGyms } from '../services/api';
import './EventForm.css';

const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const EventForm = ({ onEventAdded }) => {
    const [initial, setInitial] = useState('');
    const [gym, setGym] = useState('');
    const [day, setDay] = useState('');
    const [gyms, setGyms] = useState([]);

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const gymsData = await getGyms();
                setGyms(gymsData || []);
            } catch (error) {
                console.error("Failed to fetch gyms:", error);
            }
        };
        fetchGyms();
    }, []);

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
                    {daysOfWeek.map((d) => (
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
