// src/components/EventTable.js
import React, { useEffect, useState } from 'react';
import { getEvents, getGyms, addGym } from '../services/api';
import './EventTable.css';

const EventTable = ({ onGymAdded, refreshTrigger }) => {
    const [events, setEvents] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [newGym, setNewGym] = useState('');
    const [orderedDays, setOrderedDays] = useState([]);

    const daysOfWeek = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday",];

    useEffect(() => {
       const pstDayIndex = new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            weekday: "long",
        });

        // Convert weekday string back to index
        const todayIndex = daysOfWeek.indexOf(pstDayIndex);

        // Rotate days so PST today is first
        const rolledDays = [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)];
        setOrderedDays(rolledDays);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        const [eventsData, gymsData] = await Promise.all([getEvents(), getGyms()]);
        setEvents(eventsData);
        setGyms(gymsData);
        };
        fetchData();
    }, [refreshTrigger]);

    const schedule = {};
    gyms.forEach(gym => {
        schedule[gym] = {};
        daysOfWeek.forEach(day => {
        const dayEvents = events?.[day] || [];
        schedule[gym][day] = dayEvents
            .filter(ev => ev.gym === gym)
            .map(ev => ev.initial);
        });
    });

    const handleAddGym = async (e) => {
        e.preventDefault();
        
        if (!newGym.trim()) return;

        await addGym({ gym: newGym });

        setNewGym('');

        if (onGymAdded) {
            onGymAdded();
        }
    };

    // Use orderedDays if available, otherwise use daysOfWeek
    const displayDays = orderedDays.length > 0 ? orderedDays : daysOfWeek;

    return (
        <div className="event-table-container">
        <table className="event-table">
            <thead>
            <tr>
                <th>Gym / Day</th>
                {displayDays.map(day => <th key={day}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {gyms.map(gym => (
                <tr key={gym}>
                <td className="gym-cell">{gym}</td>
                {displayDays.map(day => (
                    <td key={day}>{(schedule[gym][day] || []).join(", ")}</td>
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
                {displayDays.map(day => <td key={day}></td>)}
            </tr>
            </tbody>
        </table>
        </div>
    );
};

export default EventTable;
