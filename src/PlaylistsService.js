const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const playlistData = await this.getPlaylistMeta(playlistId);

    const query = {
      text: `SELECT s.id, s.performer, s.title FROM songs s
      INNER JOIN playlist_songs ps ON ps.song_id = s.id
      WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const songs = result.rows;

    return {
      playlist: {
        id: playlistId,
        name: playlistData.name,
        songs,
      },
    };
  }

  async getPlaylistMeta(playlistId) {
    const query = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = PlaylistsService;
