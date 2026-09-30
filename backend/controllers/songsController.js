const db = require('../db');

exports.getAllSongs = (req, res) => {
  const sql = `SELECT songs.*, albums.album_name FROM songs JOIN albums ON songs.album_id = albums.album_id ORDER BY song_id`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.status(200).json({ success: true, data: rows });
  });
};

exports.getSongById = (req, res) => {
  const sql = `SELECT songs.*, albums.album_name FROM songs JOIN albums ON songs.album_id = albums.album_id WHERE song_id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, error: 'Song not found' });
    res.status(200).json({ success: true, data: row });
  });
};

exports.createSong = (req, res) => {
  const { song_name, release_year, album_id } = req.body;
  if (!song_name || !release_year || !album_id) {
    return res.status(400).json({ success: false, error: 'song_name, release_year and album_id are required' });
  }
  db.run('INSERT INTO songs (song_name, release_year, album_id) VALUES (?, ?, ?)',
    [song_name, release_year, album_id], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.status(201).json({ success: true, message: 'Song created', data: { song_id: this.lastID, song_name, release_year, album_id } });
    });
};

exports.updateSong = (req, res) => {
  const { song_name, release_year, album_id } = req.body;
  if (!song_name || !release_year || !album_id) {
    return res.status(400).json({ success: false, error: 'song_name, release_year and album_id are required' });
  }
  db.run('UPDATE songs SET song_name = ?, release_year = ?, album_id = ? WHERE song_id = ?',
    [song_name, release_year, album_id, req.params.id], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes === 0) return res.status(404).json({ success: false, error: 'Song not found' });
      res.status(200).json({ success: true, message: 'Song updated' });
    });
};

exports.deleteSong = (req, res) => {
  db.run('DELETE FROM songs WHERE song_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Song not found' });
    res.status(200).json({ success: true, message: 'Song deleted' });
  });
};
