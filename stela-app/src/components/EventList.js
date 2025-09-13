// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData = await getEvents();
            setEvents(eventsData);
        };
        fetchEvents();
    }, []);

    return (
        <div>
            <h2>Event List</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        <strong>{event.title}</strong>
                        <p>{event.description}</p>
                        <small>{event.date}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;

