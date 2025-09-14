// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/events';

export const getEvents = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("fetched")
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export const addEvent = async (event) => {
    try {
        const response = await axios.post(API_URL, event);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error adding event:', error);
    }
};

export const deleteEvent = async (event) => {
    try {
        const response = await axios.delete(API_URL, { data: event });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error adding event:', error);
    }
};
