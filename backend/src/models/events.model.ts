import pool from '../db';

export interface Event {
  id?: number;
  event_type: string;
  document_id?: number;
  contact_id?: number;
  event_timestamp?: string;
}

export async function createEvent(event: Event): Promise<Event> {
  const result = await pool.query(
    `INSERT INTO events (event_type, document_id, contact_id) VALUES ($1, $2, $3) RETURNING *;`,
    [event.event_type, event.document_id || null, event.contact_id || null]
  );
  return result.rows[0];
}
