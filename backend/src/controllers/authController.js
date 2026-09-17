const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// Login Controller
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let users;
    if (db.isFallback()) {
      users = db.getMockData().users.filter(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    
    // Production bcrypt comparison
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        interests: user.interests
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        interests: user.interests
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

// Register Controller
async function register(req, res) {
  try {
    const { name, email, password, role = 'student', department = 'CMPN', interests = 'Cloud, AI' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    let existing;
    if (db.isFallback()) {
      existing = db.getMockData().users.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      existing = rows[0];
    }

    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser;
    if (db.isFallback()) {
      const newId = db.getMockData().users.length + 1;
      newUser = {
        user_id: newId,
        name,
        email,
        password: hashedPassword,
        role,
        department,
        interests,
        created_at: new Date()
      };
      db.getMockData().users.push(newUser);
    } else {
      const result = await db.query(
        'INSERT INTO users (name, email, password, role, department, interests) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, role, department, interests]
      );
      newUser = {
        user_id: result.insertId,
        name,
        email,
        role,
        department,
        interests
      };
    }

    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        department: newUser.department,
        interests: newUser.interests
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        user_id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        interests: newUser.interests
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

// Get Current User Profile
async function getProfile(req, res) {
  try {
    const userId = req.user.user_id;
    let user;

    if (db.isFallback()) {
      user = db.getMockData().users.find(u => u.user_id === userId);
    } else {
      const rows = await db.query('SELECT user_id, name, email, role, department, interests, created_at FROM users WHERE user_id = ?', [userId]);
      user = rows[0];
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        interests: user.interests,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}

module.exports = {
  login,
  register,
  getProfile
};
