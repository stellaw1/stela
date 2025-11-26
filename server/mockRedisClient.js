// mockRedisClient.js
// This is a mock replacement for the Redis client used in server.js

class MockRedisClient {
    constructor() {
        this.data = {
            events: {},
            gyms: []
        };
    }

    on(event, callback) {
        // No-op for mock
    }

    async connect() {
        // No-op for mock
    }

    // Simulate Redis JSON.SET
    async jsonSet(key, path, value) {
        this.data[key] = value;
        return value;
    }

    // Simulate Redis JSON.GET
    async jsonGet(key, path) {
        return this.data[key];
    }

    // Simulate Redis JSON.ARRAPPEND
    async jsonArrAppend(key, path, value) {
        if (Array.isArray(this.data[key])) {
            this.data[key].push(value);
        } else if (typeof this.data[key] === 'object' && path.startsWith('$.')) {
            const day = path.slice(2);
            this.data[key][day].push(value);
        }
        return value;
    }
}

// Export an instance with the same API as the real Redis client
const mockClient = {
    on: (...args) => {},
    connect: async () => {},
    json: {
        set: async (key, path, value) => mockClient._client.jsonSet(key, path, value),
        get: async (key, path) => mockClient._client.jsonGet(key, path),
        arrAppend: async (key, path, value) => mockClient._client.jsonArrAppend(key, path, value),
    },
    _client: new MockRedisClient(),
};

module.exports = mockClient;
