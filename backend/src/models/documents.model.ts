import pool from '../db';

export interface Document {
  id?: number;
  filename: string;
  file_type: string;
  file_data?: Buffer;
  uploaded_at?: string;
}

export async function createDocument(doc: Document): Promise<Document> {
  const result = await pool.query(
    `INSERT INTO documents (filename, file_type, file_data) VALUES ($1, $2, $3) RETURNING *;`,
    [doc.filename, doc.file_type, doc.file_data || null]
  );
  return result.rows[0];
}
