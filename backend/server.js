const express = require('express');
const cors = require('cors');
require('./db');

const artistsRoutes = require('./routes/artists');
const albumsRoutes = require('./routes/albums');
const songsRoutes = require('./routes/songs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Music Library API by Ray Gadliauskas',
    endpoints: ['/artists', '/albums', '/songs']
  });
});

app.use('/artists', artistsRoutes);
app.use('/albums', albumsRoutes);
app.use('/songs', songsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
