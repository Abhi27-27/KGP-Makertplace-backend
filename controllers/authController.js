import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  rollNumber: user.rollNumber,
  hall: user.hall,
  createdAt: user.createdAt,
  token: generateToken(user._id),
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, rollNumber, hall, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const rollExists = await User.findOne({ rollNumber });
    if (rollExists) return res.status(400).json({ message: 'Roll number already registered' });

    const user = await User.create({ name, email, rollNumber, hall: hall || '', password });
    res.status(201).json(userPayload(user));
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json(userPayload(user));
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
