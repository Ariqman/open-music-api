const ClientError = require('../../exceptions/ClientError');

class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postMusicHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const { title = 'untitled', year, performer, genre, duration  } = request.payload;

      const noteId = await this._service.addSong({ title, year, performer, genre, duration  });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

}    

module.exports = MusicHandler;
