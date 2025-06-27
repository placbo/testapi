const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8083;

// Configure CORS for specific origins only
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost and kasselars.com (including subdomains)
    const allowedOrigins = [
      /^http:\/\/localhost(:[0-9]+)?$/,
      /^https?:\/\/(.+\.)?kasselars\.com$/
    ];

    const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true
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

app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});