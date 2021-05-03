const profile = require('./profile');
const main = require('./main');
const game = require('./game');
const constructorMethod = (app) => {
  app.use('/profile', profile);
  app.use('/game', game);
  app.use('/', main);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;