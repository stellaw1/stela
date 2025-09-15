// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';

const EventTable = ({ refreshTrigger }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData = await getEvents();
            setEvents(eventsData);
        };
        fetchEvents();
    }, [refreshTrigger]);

    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    
    // Step 1: Safely collect all events
    const allEvents = daysOfWeek.flatMap(day => (events?.[day] || []));

    // Step 2: Get unique gyms from all events
    const gyms = Array.from(new Set(allEvents.map(event => event.gym)));

    // Step 3: Build a schedule lookup: gym -> day -> [initials]
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

    // Optional: early return if no data
    // if (gyms.length === 0) {
    //     return <p>No events scheduled.</p>;
    // }

    return (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", textAlign: "center", width: "100%" }}>
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
        </tbody>
        </table>
    );
};

export default EventTable;
