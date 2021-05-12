const profile = require('./profile');
const main = require('./main');
const games = require('./games');
const constructorMethod = (app) => {
  app.use('/profile', profile);
  app.use('/games', games);
  app.use('/', main);
  app.use('*', (req, res) => {
    let url = `http://localhost:3000${req.baseUrl}`;
    res.status(404).render("notfound.handlebars", {title: "Not found", route: url})
  });
};

module.exports = constructorMethod;