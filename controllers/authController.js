// const bcrypt = require('bcrypt');
// const User = require('../models/User');

// exports.register = async (req, res) => {
//   const { username, password } = req.body;
//   const existingUser = await User.findOne({ username });

//   if (existingUser) {
//     return res.status(400).json({ message: 'Username already exists' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
