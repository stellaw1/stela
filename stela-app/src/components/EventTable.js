// src/components/EventTable.js
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';
import './EventTable.css';

const EventTable = ({ refreshTrigger }) => {
    const [events, setEvents] = useState([]);
    const [newEventGym, setNewEventGym] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData = await getEvents();
            setEvents(eventsData);
        };
        fetchEvents();
    }, [refreshTrigger]);

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const allEvents = daysOfWeek.flatMap(day => (events?.[day] || []));
    const gyms = Array.from(new Set(allEvents.map(event => event.gym)));

    const schedule = {};
    gyms.forEach(gym => {
        schedule[gym] = {};
        daysOfWeek.forEach(day => {
            const dayEvents = events?.[day] || [];
            schedule[gym][day] = dayEvents
                .filter(event => event.gym === gym)
                .map(event => event.initial);
        });
    });

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (!newEventGym.trim()) return;

        console.log("New gym submitted:", newEventGym);
        setNewEventGym('');
    };

    return (
        <div className="event-table-container">
            <table className="event-table">
                <thead>
                    <tr>
                        <th>Gym / Day</th>
                        {daysOfWeek.map(day => (
                            <th key={day}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {gyms.map(gym => (
                        <tr key={gym}>
                            <td><strong>{gym}</strong></td>
                            {daysOfWeek.map(day => (
                                <td key={day}>
                                    {schedule[gym][day].length > 0
                                        ? schedule[gym][day].join(", ")
                                        : ""}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {/* Transparent input row */}
                    <tr className="new-gym-row">
                        <td>
                            <form onSubmit={handleAddEvent}>
                                <input
                                    type="text"
                                    value={newEventGym}
                                    onChange={(e) => setNewEventGym(e.target.value)}
                                    placeholder="Add gym..."
                                    className="new-gym-input"
                                />
                            </form>
                        </td>
                        {daysOfWeek.map(day => (
                            <td key={day}></td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EventTable;
