import request from 'supertest';
import {app} from '../setup';

describe('Contribution API', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Contributor',
        email: 'contributor@example.com',
        password: '123456',
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'contributor@example.com',
        password: '123456',
      });
    token = loginRes.body.token;
    userId = loginRes.body.user.id;
  }, 10000);

  it('should log a contribution with valid token', async () => {
    const res = await request(app)
      .post('/api/contributions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        amount: 50,
        cycleNumber: 1,
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Contribution logged');
  });

  it('should fail to log contribution without token', async () => {
    const res = await request(app)
      .post('/api/contributions')
      .send({
        userId,
        amount: 50,
        cycleNumber: 1,
      });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token provided');
  });

  it('should retrieve contribution history', async () => {
    await request(app)
      .post('/api/contributions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,
        amount: 50,
        cycleNumber: 1,
      });

    const res = await request(app)
      .get('/api/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});