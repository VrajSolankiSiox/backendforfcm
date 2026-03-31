require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const app = express();
 
connectDB();
 
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sendnotification', require('./sendnotification'));
app.use('/api/auth', require('./auth'));
app.use('/api/fcm-token', require('./fcmToken'));
app.use('/api/location', require('./location'));

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
