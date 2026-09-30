PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;

CREATE TABLE artists (
  artist_id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  monthly_listeners INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE albums (
  album_id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_name TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  number_of_listens INTEGER NOT NULL DEFAULT 0,
  artist_id INTEGER NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

CREATE TABLE songs (
  song_id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_name TEXT NOT NULL,
  release_year INTEGER NOT NULL,
  album_id INTEGER NOT NULL,
  FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE
);

INSERT INTO artists (artist_name, genre, monthly_listeners) VALUES
('The Weeknd', 'Pop/R&B', 114000000),
('Daft Punk', 'Electronic', 25000000);

INSERT INTO albums (album_name, release_year, number_of_listens, artist_id) VALUES
('After Hours', 2020, 420000000, 1),
('Dawn FM', 2022, 280000000, 1),
('Starboy', 2016, 510000000, 1),
('Discovery', 2001, 300000000, 2),
('Random Access Memories', 2013, 350000000, 2);

INSERT INTO songs (song_name, release_year, album_id) VALUES
('Blinding Lights', 2020, 1),
('Save Your Tears', 2020, 1),
('Heartless', 2020, 1),
('Take My Breath', 2022, 2),
('Sacrifice', 2022, 2),
('Starboy', 2016, 3),
('I Feel It Coming', 2016, 3),
('One More Time', 2001, 4),
('Harder Better Faster Stronger', 2001, 4),
('Get Lucky', 2013, 5);
