import request from 'supertest';
import { app } from '../setup'; 

describe('Auth API', () => {
  it('should check if the server is running', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Merry-Go-Round Backend is Running!');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered');
  });

  it('should login a user and return a token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test2@example.com',
        password: '123456',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test2@example.com',
        password: '123456',
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test3@example.com',
        password: '123456',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test3@example.com',
        password: 'wrongpassword',
      });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});