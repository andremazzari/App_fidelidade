//external dependencies
import Redis from 'redis';
import { createClient } from 'redis';

//internal dependencies
import Utils from '../utils/Utils';

class RedisClient {
    private client: Redis.RedisClientType | null = null;

    constructor() {
        this.initialize()
    }

    async initialize(): Promise<void> {
        this.client = createClient();

        this.client.on('error', err => console.log('Redis Client Error', err));

        await this.client.connect();
        console.log('Connection with Redis created!');
    }

    async get(key: string): Promise<Record<string, any> | string | null> {
        if (this.client == null) {
            throw new Error('Connection with Redis not open.')
        }

        const value = await this.client.get(key);

        return Utils.parseJSONorString(value);
    }

    async set(key: string, value: string | Record<string, any>, options?: Record<string, any>): Promise<void> {
        if (this.client == null) {
            throw new Error('Connection with Redis not open.')
        }
        
        if (Utils.isRecordObject(value)) {
            value = JSON.stringify(value)
        }
        
        await this.client?.set(key, value, options)
    }

    async del(key: string) {
        if (this.client == null) {
            throw new Error('Connection with Redis not open.')
        }
        
        await this.client.del(key);
    }
}

export const redisClient = new RedisClient();