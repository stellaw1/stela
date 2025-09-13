const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const port = 5000;

// Connect to Redis
const client = redis.createClient({ url: 'redis://localhost:6379' });
client.connect();

app.use(cors());
app.use(express.json());

// API to get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await client.lRange('events', 0, -1);
        res.json(events.map(event => JSON.parse(event)));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// API to add an event
app.post('/api/events', async (req, res) => {
    const { title, date, description } = req.body;
    const event = { title, date, description };

    try {
        await client.rPush('events', JSON.stringify(event));
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add event' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

