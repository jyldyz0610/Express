const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'einEindeutigesundStarkesGeheimnis',
  resave: false,
  saveUninitialized: false
}));

// Dummy Benutzerdaten mit gehashten Passwörtern
const users = [
  { username: 'user1', password: '$2b$10$1D32hXY4E8cg2AYpSPi.8.JLVcGk1Wt/8Ks4Gv1BgQa4rwsdKjKD2' }, // Passwort: password1
  { username: 'user2', password: '$2b$10$1D32hXY4E8cg2AYpSPi.8.JLVcGk1Wt/8Ks4Gv1BgQa4rwsdKjKD2' }  // Passwort: password2
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', handleLogin);
app.post('/register', handleRegister);
app.get('/logout', handleLogout);
app.get('/test', handleTest);

// Login
function handleLogin(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.send('Login erfolgreich!');
  } else {
    res.status(401).send('Ungültige Anmeldeinformationen!');
  }
}

// Registrierung
function handleRegister(req, res) {
  const { username, password } = req.body;
  const existingUser = users.find(u => u.username === username);

  if (existingUser) {
    return res.status(400).send('Benutzername bereits vergeben.');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ username, password: hashedPassword });

  res.send('Registrierung erfolgreich!');
}

// Logout
function handleLogout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Serverfehler');
    } else {
      res.send('Logout erfolgreich!');
    }
  });
}

// Test
function handleTest(req, res) {
  if (req.session.user) {
    res.send(`Benutzer eingeloggt als ${req.session.user.username}`);
  } else {
    res.send('Benutzer nicht eingeloggt');
  }
}

// Starte den Server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
