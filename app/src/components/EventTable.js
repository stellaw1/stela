// src/components/EventTable.js
import React, { useState, useEffect } from 'react';
import { addGym } from '../services/api';
import { isPastDate } from '../utils/dateHelpers';
import './EventTable.css';

const EventTable = ({ onGymAdded, refreshTrigger, gyms, events}) => {
    const [newGym, setNewGym] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const daysPerPage = 7;

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

    const sortedDates = Object.keys(events).sort();
    const totalPages = Math.ceil(sortedDates.length / daysPerPage);
    const startIdx = currentPage * daysPerPage;
    const endIdx = startIdx + daysPerPage;
    const visibleDates = sortedDates.slice(startIdx, endIdx);

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <div className="event-table-wrapper">
            <div className="event-table-container">
                <table className="event-table">
                    <thead>
                    <tr>
                        <th>Gym / Date</th>
                        {visibleDates.map(date => {
                            // Needed to convert date string to Date in PST
                            const day = new Date(date + "T00:00:00-08:00");
                            // Format: 'Dec 1'
                            const dateStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            // Format: 'Sunday', 'Monday', etc.
                            const weekdateStr = day.toLocaleDateString('en-US', { weekday: 'long' });
                            const isPast = isPastDate(date);
                            return (
                                <th key={date} className={`event-table-header-cell ${isPast ? 'past-date' : ''}`}>
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
                        {visibleDates.map(date => (
                            <td key={date} className={isPastDate(date) ? 'past-date' : ''}>{(events[date][gym] || []).join(", ")}</td>
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
                        {visibleDates.map(date => <td key={date} className={isPastDate(date) ? 'past-date' : ''}></td>)}
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="pagination-controls">
                <button 
                    className="pagination-button pagination-prev"
                    onClick={handlePrevious}
                    disabled={currentPage === 0}
                    aria-label="Previous dates"
                >
                    ← Back
                </button>
                <span className="pagination-info">
                    {currentPage + 1} / {totalPages || 1}
                </span>
                <button 
                    className="pagination-button pagination-next"
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
                    aria-label="Next dates"
                >
                    Forward →
                </button>
            </div>
        </div>
    );
};

export default EventTable;
