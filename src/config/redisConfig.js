import { createClient } from 'redis';

let client;

const connectRedis = async () => {
    try {
        client = await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};

const setValue = async (key, value) => {
    try {
        console.log('Setting value', key, JSON.stringify(value));
        await client.set(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting value in Redis:', error);
    }
};

const getValue = async (key) => {
    try {
        console.log('Getting value for key', key);
        const value = await client.get(key);
        console.log('Retrieved value:', value);
        return JSON.parse(value);
    } catch (error) {
        console.error('Error getting value from Redis:', error);
        return null;
    }
};

module.exports = { connectRedis, setValue, getValue };
