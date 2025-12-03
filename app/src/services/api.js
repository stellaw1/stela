// src/services/api.js
import axios from 'axios';

const API_URL = 'https://apyic6eiwi.execute-api.us-west-2.amazonaws.com/prod';

export const getGyms = async () => {
    try {
        const response = await axios.get(API_URL + "/gyms");
        return response.data;
    } catch (error) {
        console.error('Error fetching gyms:', error);
        return [];
    }
};

export const addGym = async (event) => {
    try {
        const response = await axios.post(API_URL + "/gyms", event);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error adding gym:', error);
    }
};

export const getEvents = async () => {
    try {
        const response = await axios.get(API_URL + "/events");
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export const addEvent = async (event) => {
    try {
        const response = await axios.post(API_URL + "/events", event);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error adding event:', error);
    }
};

export const deleteEvent = async (event) => {
    try {
        const response = await axios.delete(API_URL + "/events", { data: event });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error adding event:', error);
    }
};
