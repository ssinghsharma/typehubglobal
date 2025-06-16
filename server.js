// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/error');

// // In server.js
// // const cors = require('cors');

// // Enable CORS
// app.use(cors({
//   origin: 'http://localhost:3000', // Your frontend URL
//   credentials: true
// }));
// // Load env vars
// dotenv.config({ path: './config.env' });

// // Connect to database
// connectDB();

// // Route files
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');

// const app = express();

// // Body parser
// app.use(express.json({ limit: '10kb' }));

// // Enable CORS
// app.use(cors());

// // Mount routers
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);

// // Error handling middleware
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const agentRoutes = require('./routes/agentRoutes');
// Load env vars
dotenv.config({ path: './config.env' });

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));

// Enable CORS with specific configuration
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));
app.use(cors({
  origin: ['http://localhost:3000', 'https://typehubglobal.in'], // 👈 Add your live frontend domain here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/agent', agentRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});
