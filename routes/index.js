const profile = require('./profile');
const main = require('./main');
const games = require('./games');
const nav = require('./nav');
const admin = require('./admin');
const quiz = require('./quiz');

const constructorMethod = (app) => {
  app.use('/profile', profile);
  app.use('/games', games);
  app.use('/nav', nav)
  app.use('/admin', admin)
  app.use('/quiz', quiz)
  app.use('/', main);
  app.use('*', (req, res) => {
    let url = `http://localhost:3000${req.baseUrl}`;
    res.status(404).render("notfound.handlebars", {title: "Not found", route: url})
  });
};

module.exports = constructorMethod;