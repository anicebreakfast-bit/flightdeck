// server.js
import express from 'express';
import fetch from 'node-fetch';
const app = express();

app.get('/api/airlines', async (req, res) => {
  const r = await fetch('https://flight-radar1.p.rapidapi.com/airlines/list', {
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'flight-radar1.p.rapidapi.com',
    },
  });
  res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
  res.status(r.status).send(await r.text());
});

app.listen(3001, () => console.log('proxy on :3001'));