import dotenv from "dotenv";
dotenv.config();

const getEnvVar = (key: keyof EnvConfig): string => {
    const value = process.env[key];

    if (!value) { throw new Error(`Missing required .env variable: ${key}`)}
    return value;
}

interface EnvConfig {
    'SESSION_SECRET': string;
    'DB_HOST': string;
    'DB_NAME': string;
    'DB_PORT': number;
    'DB_USER': string;
    'DB_PASSWORD': string;
}

export const config: EnvConfig = {
    SESSION_SECRET: getEnvVar("SESSION_SECRET"),
    DB_HOST: getEnvVar("DB_HOST"),
    DB_NAME: getEnvVar("DB_NAME"),
    DB_PORT: Number(getEnvVar("DB_PORT")),
    DB_USER: getEnvVar("DB_USER"),
    DB_PASSWORD: getEnvVar("DB_PASSWORD"),
}