require('dotenv').config();
const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const port = 5001;

// CORS should be applied before any routes are defined
app.use(cors({
    origin: ['http://localhost:3000'], // React app origin
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

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong'); // Send a simple response like "pong"
});

app.get('/test', (req, res) => {
    res.send('CORS is working!');
});

// API to reset all events
app.post('/api/events/reset', async (req, res) => {
    const defaultVal = {"Monday":[], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []};

    try {
        const events = await client.json.set('events', '$', defaultVal);
        res.json(events);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to reset events' });
    }
});

// API to get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await client.json.get('events', '$');
        res.json(events);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// API to add an event
app.post('/api/events', async (req, res) => {
    const { initial, gym, day } = req.body;
    const event = { initial, gym };

    try {
        await client.json.arrAppend('events', '$.' + day, event);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// API to delete an event
app.delete('/api/events', async (req, res) => {
    const { initial, gym, day } = req.body;

    try {
        const events = await client.json.get('events', '$');
        events[day] = events[day].filter(event => !(event.initial === initial && event.gym === gym))
        await client.json.set('events', '$', events);

        res.status(201).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
