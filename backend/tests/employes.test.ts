import request from 'supertest';
import app from '../src/index';

describe('API Employés', () => {
  it('GET /api/employes doit refuser sans authentification', async () => {
    const res = await request(app).get('/api/employes');
    expect(res.status).toBe(401);
  });

  // Pour tester avec authentification, il faut mocker ou générer un JWT valide
  // it('GET /api/employes retourne la liste pour un admin', async () => {
  //   const token = '...';
  //   const res = await request(app)
  //     .get('/api/employes')
  //     .set('Authorization', `Bearer ${token}`);
  //   expect(res.status).toBe(200);
  //   expect(Array.isArray(res.body)).toBe(true);
  // });
});
