// src/components/EventTable.js
import React, { useEffect, useState } from 'react';
import { getEvents, getGyms, addGym } from '../services/api';
import './EventTable.css';

const EventTable = ({ onGymAdded, refreshTrigger }) => {
    const [events, setEvents] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [newGym, setNewGym] = useState('');

    const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    });

    useEffect(() => {
        const fetchData = async () => {
        const [eventsData, gymsData] = await Promise.all([getEvents(), getGyms()]);
        setEvents(eventsData);
        setGyms(gymsData);
        };
        fetchData();
    }, [refreshTrigger]);

    const handleAddGym = async (e) => {
        e.preventDefault();
        
        if (!newGym.trim()) return;

        await addGym({ gym: newGym });

        setNewGym('');

        if (onGymAdded) {
            onGymAdded();
        }
    };

    return (
        <div className="event-table-container">
        <table className="event-table">
            <thead>
            <tr>
                <th>Gym / Day</th>
                {days.map(day => {
                    const d = new Date(day);
                    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
                    return (
                        <th key={day} style={{ verticalAlign: 'bottom' }}>
                            <div style={{ fontSize: '0.8em', color: '#888', whiteSpace: 'nowrap' }}>{day}</div>
                            <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap'}}>{weekday.toUpperCase()}</div>
                        </th>
                    );
                })}
            </tr>
            </thead>
            <tbody>
            {gyms.map(gym => (
                <tr key={gym}>
                <td className="gym-cell">{gym}</td>
                {days.map(day => (
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
                {days.map(day => <td key={day}></td>)}
            </tr>
            </tbody>
        </table>
        </div>
    );
};

export default EventTable;
