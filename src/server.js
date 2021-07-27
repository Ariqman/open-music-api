require('dotenv').config();
const Hapi = require('@hapi/hapi');
// Notes Plugin
const music = require('./api/music');
const MusicService = require('./services/postgres/musicService');
const MusicValidator = require('./validator/music');

// Users Plugin
const users = require('./api/users');
const UsersService = require('./services/postgres/usersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const musicService = new MusicService();
  const usersService = new UsersService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: music,
      options: {
        service: musicService,
        validator: MusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
