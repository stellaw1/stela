// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/api';

const EventTable = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const eventsData = await getEvents();
            setEvents(eventsData);
        };
        fetchEvents();
    }, []);

    const gyms = ["progression", "hive"];
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    
    const schedule = {};

    gyms.forEach(gym => {
      schedule[gym] = {};
      daysOfWeek.forEach(day => {
        schedule[gym][day] = (events[day] || [])
          .filter(event => event.gym === gym)
          .map(event => event.initial);
      });
    });
  
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

