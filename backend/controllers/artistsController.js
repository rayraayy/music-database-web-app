const db = require('../db');

exports.getAllArtists = (req, res) => {
  db.all('SELECT * FROM artists ORDER BY artist_id', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.status(200).json({ success: true, data: rows });
  });
};

exports.getArtistById = (req, res) => {
  db.get('SELECT * FROM artists WHERE artist_id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, error: 'Artist not found' });
    res.status(200).json({ success: true, data: row });
  });
};

exports.createArtist = (req, res) => {
  const { artist_name, genre, monthly_listeners } = req.body;
  if (!artist_name || !genre || monthly_listeners === undefined) {
    return res.status(400).json({ success: false, error: 'artist_name, genre and monthly_listeners are required' });
  }
  db.run('INSERT INTO artists (artist_name, genre, monthly_listeners) VALUES (?, ?, ?)',
    [artist_name, genre, monthly_listeners], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.status(201).json({ success: true, message: 'Artist created', data: { artist_id: this.lastID, artist_name, genre, monthly_listeners } });
    });
};

exports.updateArtist = (req, res) => {
  const { artist_name, genre, monthly_listeners } = req.body;
  if (!artist_name || !genre || monthly_listeners === undefined) {
    return res.status(400).json({ success: false, error: 'artist_name, genre and monthly_listeners are required' });
  }
  db.run('UPDATE artists SET artist_name = ?, genre = ?, monthly_listeners = ? WHERE artist_id = ?',
    [artist_name, genre, monthly_listeners, req.params.id], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes === 0) return res.status(404).json({ success: false, error: 'Artist not found' });
      res.status(200).json({ success: true, message: 'Artist updated' });
    });
};

exports.deleteArtist = (req, res) => {
  db.run('DELETE FROM artists WHERE artist_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Artist not found' });
    res.status(200).json({ success: true, message: 'Artist deleted. Related albums and songs were deleted by cascade.' });
  });
};
