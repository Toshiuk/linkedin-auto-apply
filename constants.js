import dotenv from 'dotenv';

dotenv.config();

export const SECOND = 1000;

export const username = process.env.USERNAME;
export const password = process.env.PASSWORD;

export const searchTerm = process.env.SEARCH_TERM.replace(' ', '%20');
export const searchArea = process.env.SEARCH_AREA.replace(' ', '%20');
