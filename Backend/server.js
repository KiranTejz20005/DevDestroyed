import './config.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

import responseRouter from './routes/response.js';
import roastRouter from './routes/roast.js';
import linkedinRoastRouter from './routes/linkedinRoast.js';

const app = new Hono();

app.use('*', cors({
  origin: (origin) => {
    // Dynamically allow the origin if it's localhost or vercel/render
    if (!origin) return '*';
    if (origin.includes('localhost') || origin.includes('vercel.app') || origin.includes('onrender.com')) {
      return origin;
    }
    return 'https://dev-destroyed.vercel.app'; // Default fallback
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

const port = process.env.PORT || 3001;

app.get('/', (c) => c.text('Hello World!'));

app.route('/api/responses', responseRouter);
app.route('/api/roast', roastRouter);
app.route('/api/roast/linkedin', linkedinRoastRouter);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);
