import pool from '../db';

export interface Contact {
  id?: number;
  full_name: string;
  preferred_name?: string;
  date_of_birth?: string;
  phone?: string;
  email: string;
  address?: string;
  social_profiles?: object;
  family_details?: object;
  interests?: string[];
  important_dates?: object;
  personality_notes?: string;
  other_details?: string;
  created_at?: string;
  updated_at?: string;
  last_event_id?: number;
}

export async function createContact(contact: Contact): Promise<Contact> {
  const result = await pool.query(
    `INSERT INTO contacts (full_name, preferred_name, date_of_birth, phone, email, address, social_profiles, family_details, interests, important_dates, personality_notes, other_details)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *;`,
    [
      contact.full_name,
      contact.preferred_name || null,
      contact.date_of_birth || null,
      contact.phone || null,
      contact.email,
      contact.address || null,
      contact.social_profiles || null,
      contact.family_details || null,
      contact.interests || null,
      contact.important_dates || null,
      contact.personality_notes || null,
      contact.other_details || null
    ]
  );
  return result.rows[0];
}

export async function getContactById(id: number): Promise<Contact | null> {
  const result = await pool.query(
    `SELECT * FROM contacts WHERE id = $1;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateContact(id: number, fields: Partial<Contact>): Promise<Contact | null> {
  const set: string[] = [];
  const values: any[] = [];
  let i = 1;
  for (const key in fields) {
    set.push(`${key} = $${i}`);
    // @ts-ignore
    values.push(fields[key]);
    i++;
  }
  if (set.length === 0) {
    return getContactById(id);
  }
  // Append id for WHERE clause
  values.push(id);
  const result = await pool.query(
    `UPDATE contacts SET ${set.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${i} RETURNING *;`,
    values
  );
  return result.rows[0] || null;
}
