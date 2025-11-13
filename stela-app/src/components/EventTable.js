// src/components/EventTable.js
import React, { useEffect, useState } from 'react';
import { getEvents, getGyms, addGym } from '../services/api';
import './EventTable.css';

const EventTable = ({ onGymsUpdated, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [newGym, setNewGym] = useState('');

  const daysOfWeek = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

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

    try {
      await addGym({ gym: newGym });
      setNewGym('');
      const gymsData = await getGyms();
      setGyms(gymsData);
      onGymsUpdated?.(gymsData);
    } catch (err) {
      console.error("Failed to add gym:", err);
    }
  };

  return (
    <div className="event-table-container">
      <table className="event-table">
        <thead>
          <tr>
            <th>Gym / Day</th>
            {daysOfWeek.map(day => <th key={day}>{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {gyms.map(gym => (
            <tr key={gym}>
              <td className="gym-cell">{gym}</td>
              {daysOfWeek.map(day => (
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
                  onChange={e => setNewGym(e.target.value)}
                  placeholder="Add gym..."
                  className="new-gym-input"
                />
              </form>
            </td>
            {daysOfWeek.map(day => <td key={day}></td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
