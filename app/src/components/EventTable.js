// src/components/EventTable.js
import React, { useState } from 'react';
import { addGym } from '../services/api';
import './EventTable.css';

const EventTable = ({ onGymAdded, refreshTrigger, gyms, events}) => {
    const [newGym, setNewGym] = useState('');

    const handleAddGym = async (e) => {
        e.preventDefault();
        
        if (!newGym.trim()) return;

        await addGym({ gym: newGym });

        setNewGym('');

        if (onGymAdded) {
            onGymAdded();
        }
    };

    if (events === null || gyms === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="event-table-container">
        <table className="event-table">
            <thead>
            <tr>
                <th>Gym / Date</th>
                {Object.keys(events).sort().map(date => {
                    // Needed to convert date string to Date in PST
                    const day = new Date(date + "T00:00:00-08:00");
                    // Format: 'Dec 1'
                    const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    // Format: 'Sunday', 'Monday', etc.
                    const weekdateStr = day.toLocaleDateString('en-US', { weekday: 'long' });
                    return (
                        <th key={date} className="event-table-header-cell">
                            <div className="event-table-header-date">{dateStr}</div>
                            <div className="event-table-header-weekdate">{weekdateStr}</div>
                        </th>
                    );
                })}
            </tr>
            </thead>
            <tbody>
            {gyms.map(gym => (
                <tr key={gym}>
                <td className="gym-cell">{gym}</td>
                {Object.keys(events).sort().map(date => (
                    <td key={date}>{(events[date][gym] || []).join(", ")}</td>
                ))}
                </tr>
            ))}
            <tr className="new-gym-row">
                <td>
                <form onSubmit={handleAddGym}>
                    <input
                    type="text"
                    value={newGym}
                    onChange={e => setNewGym(e.target.value.toUpperCase())}
                    placeholder="Add gym..."
                    className="new-gym-input"
                    />
                </form>
                </td>
                {Object.keys(events).sort().map(date => <td key={date}></td>)}
            </tr>
            </tbody>
        </table>
        </div>
    );
};

export default EventTable;
