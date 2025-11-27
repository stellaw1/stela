require('dotenv').config();
const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const port = 5001;
const allowedOrigins = [
  'http://localhost:3000',       // local dev frontend
  'https://stela-nine.vercel.app',    // deployed frontend
  'https://bldr.stellawang.com', //deployed frontend synonym
  'https://stela-git-development-stellaw1s-projects.vercel.app', // deployed dev frontend
];

// CORS should be applied before any routes are defined
app.use(cors({
    origin: allowedOrigins, // React app origin
    methods: ['GET', 'POST', 'DELETE'],       // Allowed methods
}));

// Connect to Redis
// const client = redis.createClient({ url: 'redis://localhost:6379' });
const dbHost = process.env.REDIS_DB_HOST;
const dbPass = process.env.REDIS_DB_PASS;
const client = redis.createClient({
    username: 'default',
    password: dbPass,
    socket: {
        host: dbHost,
        port: 11692
    }
});
// const client = require('./mockRedisClient');

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong'); // Send a simple response like "pong"
});

app.get('/test', (req, res) => {
    res.send('CORS is working!');
});

// POST Api/Reset resets all events and gyms
app.post('/api/reset', async (req, res) => {
    try {
        const defaultEvents = Object.fromEntries(
        Array.from({length: 14}, (_, i) => {
            // Get current date in PST as yyyy-mm-dd, then add i days
            const d = new Date();
            d.setDate(d.getDate() + i);
            const pstString = d.toLocaleString('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' });
            return [`${pstString}`, {}];
        })
    );
        await client.json.set('events', '$', defaultEvents);
        res.status(201).json(defaultEvents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reset events' });
    }
});

// POST Api/Refresh refreshes the new 14 day window while adding the existing events for overlapping days.
app.post('/api/refresh', async (req, res) => {
    try {
        // Get the current events
        let events = await client.json.get('events', '$');
        if (!events) events = {};

        // Build the new 14 day window
        const newDays = Array.from({length: 14}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const pstString = d.toLocaleString('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' });
            return `${pstString}`;
        });

        // Build the new events object, keeping existing data for overlapping days
        const refreshedEvents = {};
        for (const day of newDays) {
            refreshedEvents[day] = events[day] || [];
        }

        await client.json.set('events', '$', refreshedEvents);
        res.status(201).json(refreshedEvents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh events' });
    }
});

// POST Api/Reset resets all gyms
app.post('/api/gyms/reset', async (req, res) => {
    const defaultGyms = [];

    try {
        const gyms = await client.json.set('gyms', '$', defaultGyms);

        res.json(defaultGyms);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to reset gyms' });
    }
});

// GET Api/gyms gets all gyms
app.get('/api/gyms', async (req, res) => {
    try {
        const gyms = await client.json.get('gyms', '$');
        res.json(gyms);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get gyms' });
    }
});

// POST Api/gyms adds a gym
app.post('/api/gyms', async (req, res) => {
    const { gym } = req.body;

    try {
        await client.json.arrAppend('gyms', '$', gym);
        res.status(201).json(gym);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add gym' });
    }
});

// GET Api/events gets all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await client.json.get('events', '$');
        res.json(events);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// POST Api/events adds an event
app.post('/api/events', async (req, res) => {
    const { initial, gym, day } = req.body;

    try {
        let events = await client.json.get('events', '$');
        events[day][gym].push(initial);

        await client.json.set('events', '$', events);
        res.status(201).json({ initial, gym, day });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// DELETE Api/events deletes an event
app.delete('/api/events', async (req, res) => {
    const { initial, gym, day } = req.body;

    try {
        const events = await client.json.get('events', '$');
        const idx = events[day][gym].indexOf(initial);
        if (idx !== -1) {
            events[day][gym].splice(idx, 1);
        }

        await client.json.set('events', '$', events);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on ${port}`);
});
