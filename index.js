const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8083;
// Aktiver CORS for alle domener
app.use(cors());
// Middleware for å tolke JSON-body
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'Minimalistisk API-server med CORS!' });
});
app.post('/echo', (req, res) => {
  res.json({ mottatt: req.body });
});
app.listen(PORT, () => {
  console.log(`Server kjører på http://localhost:${PORT}`);
});
