import { Algorithm } from "jsonwebtoken";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Server
            MONGODB_URI: string;
            CLIENT_URL: string;
            PORT: string;
            NODE_ENV: 'development' | 'production';

            // Email
            EMAIL_USER: string;
            EMAIL_PASS: string;
            EMAIL_PORT: string;
            EMAIL_HOST: string;

            // Crypto
            CRYPTO_KEY: string;
            CRYPTO_IV: string;

            // Tokens
            ACCESS_TOKEN_KEY: string;
            ACCESS_TOKEN_EXPIRY: string;
            REFRESH_TOKEN_KEY: string;
            REFRESH_TOKEN_EXPIRY: string;

            GLOBAL_TOKEN_KEY:string;
            ALGORITHM:Algorithm

            // Cloudinary
            CLOUD_NAME: string;
            CLOUD_API_KEY: string;
            CLOUD_API_SECRET: string;
        }
    }
}

export {};