import {User} from '../models/index.js';
import { generateToken } from '../utils/token.js';

export const register = async (req, res) => {
  try {
    const { name,email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = await new User({ name,email, password }).save();
    const token = generateToken(user);
    res.status(201).json({ message: 'User registered successfully',token });
  } catch (err) {
  console.error('Registration error:', err);
  res.status(500).json({ error: err.message || 'Registration failed' });
}

};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ message: 'Login successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
