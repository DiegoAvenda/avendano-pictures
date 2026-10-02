// src/api.ts – Vercel serverless entrypoint
// The @vercel/node builder turns this file into a single Vercel Function.
// Unlike src/index.ts (used for local dev/start), it must NOT call app.listen();
// instead it ensures MongoDB is connected and then delegates to the Express app.
import type { IncomingMessage, ServerResponse } from 'node:http';
import app from './app.js';
import connectDB from './config/db.js';

// An Express app is itself a (req, res) handler, so it can be invoked directly.
const server = app as unknown as (
  req: IncomingMessage,
  res: ServerResponse,
) => void;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({ success: false, message: 'MONGO_URI not configured' }),
    );
    return;
  }

  try {
    await connectDB(mongoUri);
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({ success: false, message: 'Database unavailable' }),
    );
    return;
  }

  return server(req, res);
}