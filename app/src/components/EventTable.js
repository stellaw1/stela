// src/components/EventTable.js
import React, { useEffect, useState } from 'react';
import { getEvents, getGyms, addGym } from '../services/api';
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
                <th>Gym / Day</th>
                {Object.keys(events).sort().map(day => {
                    // Needed to convert day string to Date in PST
                    const d = new Date(day + "T00:00:00-08:00");
                    // Format: 'Dec 1'
                    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    // Format: 'SUNDAY', 'MONDAY', etc.
                    const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
                    return (
                        <th key={day} style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8em', color: '#888', whiteSpace: 'nowrap' }}>{dateStr}</div>
                            <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap'}}>{weekdayStr}</div>
                        </th>
                    );
                })}
            </tr>
            </thead>
            <tbody>
            {gyms.map(gym => (
                <tr key={gym}>
                <td className="gym-cell">{gym}</td>
                {Object.keys(events).sort().map(day => (
                    <td key={day}>{(events[day][gym] || []).join(", ")}</td>
                ))}
                </tr>
            ))}
            {/* Add new gym row */}
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
                {Object.keys(events).sort().map(day => <td key={day}></td>)}
            </tr>
            </tbody>
        </table>
        </div>
    );
};

export default EventTable;
