import './config.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

import responseRouter from './routes/response.js';
import roastRouter from './routes/roast.js';

const app = new Hono();

app.use('*', cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3002',
    'https://dev-destroyed.vercel.app',
    'https://devdestroyed.vercel.app',
    'https://devdestroyed-1.onrender.com'
  ],
  credentials: true,
}));

const port = process.env.PORT || 3001;

app.get('/', (c) => c.text('Hello World!'));

app.route('/api/responses', responseRouter);
app.route('/api/roast', roastRouter);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);
