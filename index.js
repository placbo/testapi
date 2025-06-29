const express = require('express');
const cors = require('cors');
const messageService = require('./messageService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8083;

// Configure CORS for specific origins only
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost and kasselars.com (including subdomains)
    const allowedOrigins = [/^http:\/\/localhost(:[0-9]+)?$/, /^https?:\/\/(.+\.)?kasselars\.com$/];

    const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware for parsing JSON body
app.use(express.json());

app.get('/message', (req, res) => {
  res.json({ message: 'Minimalistisk API-server med CORS!' });
});

app.post('/echo', (req, res) => {
  res.json({ mottatt: req.body });
});

// Get all messages from database
app.get('/messages', async (req, res) => {
  try {
    const result = await messageService.getAllMessages();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message,
    });
  }
});

// Get specific message by ID
app.get('/messages/:id', async (req, res) => {
  try {
    const result = await messageService.getMessageById(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      const statusCode = result.message === 'Message not found' ? 404 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message,
    });
  }
});

// Save new message to database
app.post('/messages', async (req, res) => {
  try {
    const result = await messageService.createNewMessage(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message,
    });
  }
});

// Delete message by ID
app.delete('/messages/:id', async (req, res) => {
  try {
    const result = await messageService.deleteMessageById(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      const statusCode = result.message === 'Message not found' ? 404 : 500;
      res.status(statusCode).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error occurred',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
