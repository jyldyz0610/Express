const request = require('supertest');
const app = require('./app');

let server;

beforeAll((done) => {
  server = app.listen(5000, () => {
    console.log('Server läuft auf Port 5000');
    done();
  });
});

afterAll((done) => {
  server.close(() => {
    console.log('Server geschlossen');
    done();
  });
});

describe('Test Authentifizierungsroutine', () => {
  test('Login mit gültigen Anmeldeinformationen', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'user1', password: 'password1' });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Login erfolgreich!');
  });

  test('Login mit ungültigen Anmeldeinformationen', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'user1', password: 'wrongpassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Ungültige Anmeldeinformationen!');
  });

  test('Test, ob Benutzer eingeloggt ist', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Benutzer eingeloggt als user1');
  });

  test('Logout', async () => {
    const res = await request(app).get('/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Logout erfolgreich!');
  });
});
