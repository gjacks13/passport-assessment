module.exports = (app) => {
  // define empty route for initial commit
  app.get('', (req, res) => {
    res.json({});
  });
};
