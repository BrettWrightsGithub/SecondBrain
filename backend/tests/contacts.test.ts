import request from 'supertest';
import app from '../src/server';
import pool from '../src/db';

afterAll(async () => {
  await pool.end();
});

describe('Contacts API', () => {
  let createdContactId: number;

  test('POST /api/contacts creates a new contact', async () => {
    const response = await request(app)
      .post('/api/contacts')
      .send({
        full_name: 'Test User',
        email: 'test.user@example.com'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdContactId = response.body.id;
  });

  test('GET /api/contacts/:id retrieves the contact', async () => {
    const response = await request(app).get(`/api/contacts/${createdContactId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', createdContactId);
  });
});
