const API_BASE = 'http://localhost:5000';

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');

function showPage(hash) {
  const target = hash || '#home';
  pages.forEach(page => page.classList.toggle('active-page', `#${page.id}` === target));
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === target));
}

window.addEventListener('hashchange', () => showPage(location.hash));
showPage(location.hash);

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadAll() {
  await Promise.all([loadArtists(), loadAlbums(), loadSongs()]);
}

async function loadArtists() {
  const { data } = await request('/artists');
  document.getElementById('artists-table').innerHTML = data.map(artist => `
    <tr>
      <td>${artist.artist_id}</td>
      <td>${artist.artist_name}</td>
      <td>${artist.genre}</td>
      <td>${artist.monthly_listeners.toLocaleString()}</td>
      <td class="actions">
        <button class="edit" onclick='editArtist(${JSON.stringify(artist)})'>Update</button>
        <button class="delete" onclick="deleteArtist(${artist.artist_id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editArtist(artist) {
  document.getElementById('artist-id').value = artist.artist_id;
  document.getElementById('artist-name').value = artist.artist_name;
  document.getElementById('artist-genre').value = artist.genre;
  document.getElementById('artist-listeners').value = artist.monthly_listeners;
}

function resetArtistForm() {
  document.getElementById('artist-form').reset();
  document.getElementById('artist-id').value = '';
}

document.getElementById('artist-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('artist-id').value;
  const payload = {
    artist_name: document.getElementById('artist-name').value,
    genre: document.getElementById('artist-genre').value,
    monthly_listeners: Number(document.getElementById('artist-listeners').value)
  };
  await request(id ? `/artists/${id}` : '/artists', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });
  resetArtistForm();
  await loadAll();
});

async function deleteArtist(id) {
  if (!confirm('Delete this artist? Related albums and songs will also be deleted.')) return;
  await request(`/artists/${id}`, { method: 'DELETE' });
  await loadAll();
}

async function loadAlbums() {
  const { data } = await request('/albums');
  document.getElementById('albums-table').innerHTML = data.map(album => `
    <tr>
      <td>${album.album_id}</td>
      <td>${album.album_name}</td>
      <td>${album.release_year}</td>
      <td>${album.number_of_listens.toLocaleString()}</td>
      <td>${album.artist_id}</td>
      <td>${album.artist_name}</td>
      <td class="actions">
        <button class="edit" onclick='editAlbum(${JSON.stringify(album)})'>Update</button>
        <button class="delete" onclick="deleteAlbum(${album.album_id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editAlbum(album) {
  document.getElementById('album-id').value = album.album_id;
  document.getElementById('album-name').value = album.album_name;
  document.getElementById('album-year').value = album.release_year;
  document.getElementById('album-listens').value = album.number_of_listens;
  document.getElementById('album-artist-id').value = album.artist_id;
}

function resetAlbumForm() {
  document.getElementById('album-form').reset();
  document.getElementById('album-id').value = '';
}

document.getElementById('album-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('album-id').value;
  const payload = {
    album_name: document.getElementById('album-name').value,
    release_year: Number(document.getElementById('album-year').value),
    number_of_listens: Number(document.getElementById('album-listens').value),
    artist_id: Number(document.getElementById('album-artist-id').value)
  };
  await request(id ? `/albums/${id}` : '/albums', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });
  resetAlbumForm();
  await loadAll();
});

async function deleteAlbum(id) {
  if (!confirm('Delete this album? Related songs will also be deleted.')) return;
  await request(`/albums/${id}`, { method: 'DELETE' });
  await loadAll();
}

async function loadSongs() {
  const { data } = await request('/songs');
  document.getElementById('songs-table').innerHTML = data.map(song => `
    <tr>
      <td>${song.song_id}</td>
      <td>${song.song_name}</td>
      <td>${song.release_year}</td>
      <td>${song.album_id}</td>
      <td>${song.album_name}</td>
      <td class="actions">
        <button class="edit" onclick='editSong(${JSON.stringify(song)})'>Update</button>
        <button class="delete" onclick="deleteSong(${song.song_id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editSong(song) {
  document.getElementById('song-id').value = song.song_id;
  document.getElementById('song-name').value = song.song_name;
  document.getElementById('song-year').value = song.release_year;
  document.getElementById('song-album-id').value = song.album_id;
}

function resetSongForm() {
  document.getElementById('song-form').reset();
  document.getElementById('song-id').value = '';
}

document.getElementById('song-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('song-id').value;
  const payload = {
    song_name: document.getElementById('song-name').value,
    release_year: Number(document.getElementById('song-year').value),
    album_id: Number(document.getElementById('song-album-id').value)
  };
  await request(id ? `/songs/${id}` : '/songs', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(payload)
  });
  resetSongForm();
  await loadAll();
});

async function deleteSong(id) {
  if (!confirm('Delete this song?')) return;
  await request(`/songs/${id}`, { method: 'DELETE' });
  await loadAll();
}

loadAll().catch(error => {
  console.error(error);
  alert('Could not connect to the backend. Start it with: cd backend && npm install && npm start');
});
