const db = require('../db');

exports.getAllAlbums = (req, res) => {
  const sql = `SELECT albums.*, artists.artist_name FROM albums JOIN artists ON albums.artist_id = artists.artist_id ORDER BY album_id`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.status(200).json({ success: true, data: rows });
  });
};

exports.getAlbumById = (req, res) => {
  const sql = `SELECT albums.*, artists.artist_name FROM albums JOIN artists ON albums.artist_id = artists.artist_id WHERE album_id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!row) return res.status(404).json({ success: false, error: 'Album not found' });
    res.status(200).json({ success: true, data: row });
  });
};

exports.createAlbum = (req, res) => {
  const { album_name, release_year, number_of_listens, artist_id } = req.body;
  if (!album_name || !release_year || number_of_listens === undefined || !artist_id) {
    return res.status(400).json({ success: false, error: 'album_name, release_year, number_of_listens and artist_id are required' });
  }
  db.run('INSERT INTO albums (album_name, release_year, number_of_listens, artist_id) VALUES (?, ?, ?, ?)',
    [album_name, release_year, number_of_listens, artist_id], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.status(201).json({ success: true, message: 'Album created', data: { album_id: this.lastID, album_name, release_year, number_of_listens, artist_id } });
    });
};

exports.updateAlbum = (req, res) => {
  const { album_name, release_year, number_of_listens, artist_id } = req.body;
  if (!album_name || !release_year || number_of_listens === undefined || !artist_id) {
    return res.status(400).json({ success: false, error: 'album_name, release_year, number_of_listens and artist_id are required' });
  }
  db.run('UPDATE albums SET album_name = ?, release_year = ?, number_of_listens = ?, artist_id = ? WHERE album_id = ?',
    [album_name, release_year, number_of_listens, artist_id, req.params.id], function (err) {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (this.changes === 0) return res.status(404).json({ success: false, error: 'Album not found' });
      res.status(200).json({ success: true, message: 'Album updated' });
    });
};

exports.deleteAlbum = (req, res) => {
  db.run('DELETE FROM albums WHERE album_id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (this.changes === 0) return res.status(404).json({ success: false, error: 'Album not found' });
    res.status(200).json({ success: true, message: 'Album deleted. Related songs were deleted by cascade.' });
  });
};
