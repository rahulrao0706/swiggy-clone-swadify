const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');

const users = []; // in-memory
const publicUser = ({ id, name, email }) => ({ id, name, email });

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (users.some((u) => u.email === email.toLowerCase())) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }
  const user = {
    id: String(users.length + 1),
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
  };
  users.push(user);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === (email || '').toLowerCase());
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

module.exports = router;
