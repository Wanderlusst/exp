# Meeting Slots Finder

A Next.js application that allows users to manage their weekly availability and find overlapping meeting slots between multiple participants.

## Features

1. Weekly availability management for users
2. Finding overlapping meeting slots between multiple participants
3. Consideration for daily meeting thresholds and existing schedules
4. 30-minute time slot generation

## Installation Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd meeting-slots-finder
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
   - http://localhost:3000/slots - To find overlapping meeting slots
   - http://localhost:3000/user/availability/{userId} - To manage weekly availability for a user

## Project Structure

- `/app` - Next.js app router pages
- `/components` - React components
- `/lib` - Utility functions, types, and mock data

## Notes

- This application currently uses mock data stored in `/lib/data.ts` instead of Redis/Memcache
- In a production environment, you would replace the mock data with actual Redis/Memcache integration

## Redis/Memcache Integration (Future Implementation)

To implement Redis/Memcache integration:

1. Install Redis client:
```bash
npm install ioredis
```

2. Create a Redis client:
```javascript
// lib/redis.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export default redis;
```

3. Update data fetching functions to use Redis instead of mock data.

## Data Structures

The application uses the following data structures:

1. Participants - Information about participants and their daily meeting thresholds
2. ParticipantAvailability - Weekly availability for each participant
3. Schedules - Existing meeting schedules for participants