const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require("nodemailer");
const multer = require("multer");
// Import routes
const jobRoutes = require('./routes/jobRoutes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/jobs', jobRoutes);


 // Ensure this path is correct
 const JobApplication = require('./models/Job'); // Update path if necessary



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {}).then(() => {
  console.log("Connected to MongoDB");
});

// Authentication Middleware
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Define Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename to prevent conflicts
  }
});
const upload = multer({ storage: storage });

; // Replace with correct path


// Job Schema for Apply Section
const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  type: String,
  applications: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      coverLetter: String,
      file: String, // Store file path in the database
    }
  ],
});

const Job = mongoose.model('Job', jobSchema);

// User Schema for Login
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Apply Routes
// Apply Routes (Submit application with file upload)
app.post("/apply", upload.single('resume'), async (req, res) => {
  try {
    const { name, email, jobTitle, coverLetter } = req.body;
    const resumeFile = req.file ? req.file.filename : null;  // Get the uploaded file

    // Create a new job application entry
    const newApplication = new JobApplication({
      name,
      email,
      jobTitle,
      resume: resumeFile,  // Store the resume filename in the database
      coverLetter,
    });

    const savedApplication = await newApplication.save();

    // Send confirmation email
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: `We Received Your Application for the ${jobTitle} Position!`,
      text: `Hi ${name},\n\nThank you for applying for the ${jobTitle} position. We received your application along with your resume. We will review it and get back to you soon!`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email Error:", err);
      } else {
        console.log("Email Sent:", info.response);
      }
    });

    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ message: "Error submitting application", error });
  }
});

// Endpoint to view all applications
app.get("/applyread", async (req, res) => {
  try {
    const applications = await JobApplication.find();  // ✅ Correct

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// User Registration Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});


// Contact Routes
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContactMessage = new Contact({
      name,
      email,
      message,
    });

    await newContactMessage.save();
    res.json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
