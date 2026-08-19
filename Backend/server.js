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
    // Allow any origin during deployment (Vercel, Netlify, Render, Railway, custom domains)
    if (!origin) return '*';
    return origin;
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
