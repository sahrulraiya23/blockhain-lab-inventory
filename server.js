const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS

const app = express();
const port = 3000;

// Gunakan CORS untuk semua rute
app.use(cors());

// Sajikan file statis dari direktori 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Frontend server berjalan di http://localhost:${port}`);
});