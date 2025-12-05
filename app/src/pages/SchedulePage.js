// src/pages/SchedulePage.js
import React, { useEffect, useState } from 'react';
import ScheduleTable from '../components/ScheduleTable';
import ScheduleForm from '../components/ScheduleForm';
import { getGyms, getEvents } from '../services/api';

function SchedulePage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [gyms, setGyms] = useState([]);
    const [events, setEvents] = useState(null);

    // Called when any event or gym is added, triggers ScheduleTable refresh
    const handleEventAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    useEffect(() => {
        const fetchData = async () => {
            const [gymsData, eventsData] = await Promise.all([
                getGyms(),
                getEvents()
            ]);
            setGyms(gymsData);
            setEvents(eventsData);
        };
        fetchData();
    }, [refreshTrigger]);

    const handleGymAdded = () => setRefreshTrigger(prev => prev + 1);

    return (
        <>
            <div className="panel">
                <ScheduleTable
                    refreshTrigger={refreshTrigger}
                    onGymAdded={handleGymAdded}
                    gyms={gyms}
                    events={events}
                />
            </div>
            <div className="panel">
                <ScheduleForm
                    onEventAdded={handleEventAdded}
                    gyms={gyms}
                    events={events}
                />
            </div>
        </>
    );
}

export default SchedulePage;
