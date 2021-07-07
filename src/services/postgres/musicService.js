const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utilities');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicService {
    constructor(){
        this._pool = new Pool();
    }

    async addSong ({ title, year, performer, genre, duration }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
          };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan');
          }
      
          return result.rows[0].id;
    }

    async getSongs (){
        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows.map(mapDBToModel);
    }

    async getSongsById(){

    }
}